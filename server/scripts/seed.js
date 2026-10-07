/**
 * Seeds demo users and internships.
 *
 *   node scripts/seed.js                    # seed using MONGO_URI from .env
 *   node scripts/seed.js --uri "mongodb+srv://..."
 *   node scripts/seed.js --users 60         # how many demo users (default 60)
 *   node scripts/seed.js --clean            # remove everything this script created
 *   node scripts/seed.js --wipe-all --yes   # delete EVERY user and internship
 *
 * Each demo user is a real Firebase Auth account (email demo_…@example.com,
 * already verified) plus a Mongo profile linked by firebaseUid. Everything is
 * namespaced under the DEMO_PREFIX username prefix, so --clean removes exactly
 * the seeded data and nothing else. Writing to a non-localhost database
 * requires --yes.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Internship from "../models/Internship.js";
import { adminAuth } from "../config/firebase.js";
import {
    DEMO_PREFIX,
    DEMO_PASSWORD,
    demoEmail,
    makeUsernames,
    buildInternship,
    randInt,
} from "./demo-data.js";

dotenv.config();

const arg = (flag, fallback = null) => {
    const i = process.argv.indexOf(flag);
    return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")
        ? process.argv[i + 1]
        : fallback;
};
const has = (flag) => process.argv.includes(flag);

const uri = arg("--uri", process.env.MONGO_URI);
const userCount = Number(arg("--users", 60));

// Firebase rate-limits account creation, so keep a lid on parallel requests.
const CONCURRENCY = 5;

const connect = async () => {
    if (!uri) {
        console.error("No MONGO_URI. Set it in server/.env or pass --uri \"<connection string>\".");
        process.exit(1);
    }

    const isLocal = /(localhost|127\.0\.0\.1)/.test(uri);
    if (!isLocal && !has("--yes")) {
        const host = uri.split("@")[1]?.split(/[/?]/)[0] ?? "(unknown host)";
        console.error(`Refusing to write to a remote database (${host}) without --yes.`);
        console.error("Re-run with --yes once you're sure it's the database you want.");
        process.exit(1);
    }

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log(`Connected to "${mongoose.connection.db.databaseName}"`);
};

// Runs `fn` over `items` with at most CONCURRENCY in flight.
const mapLimit = async (items, fn) => {
    const results = [];
    for (let i = 0; i < items.length; i += CONCURRENCY) {
        results.push(...(await Promise.all(items.slice(i, i + CONCURRENCY).map(fn))));
    }
    return results;
};

// Deletes the given users' internships, Firebase accounts and profiles.
const removeUsers = async (users) => {
    const uids = users.map((u) => u.firebaseUid).filter(Boolean);
    let firebaseRemoved = 0;
    // deleteUsers accepts at most 1000 uids per call
    for (let i = 0; i < uids.length; i += 1000) {
        const { successCount } = await adminAuth().deleteUsers(uids.slice(i, i + 1000));
        firebaseRemoved += successCount;
    }

    const ids = users.map((u) => u._id);
    const { deletedCount: internships } = await Internship.deleteMany({ user: { $in: ids } });
    const { deletedCount: removed } = await User.deleteMany({ _id: { $in: ids } });
    console.log(`Removed ${removed} users (${firebaseRemoved} Firebase accounts) and ${internships} internships.`);
};

const clean = async () => {
    const users = await User.find({ username: new RegExp("^" + DEMO_PREFIX) }).select("_id firebaseUid");
    await removeUsers(users);
};

// One-off reset for the move to Firebase Auth. Also catches orphaned
// internships whose owner no longer exists.
const wipeAll = async () => {
    if (!has("--yes")) {
        console.error("--wipe-all deletes every user and internship. Re-run with --yes to confirm.");
        process.exit(1);
    }
    await removeUsers(await User.find().select("_id firebaseUid"));
    const { deletedCount } = await Internship.deleteMany({});
    if (deletedCount) console.log(`Removed ${deletedCount} orphaned internships.`);
};

const createDemoUser = async (username) => {
    const email = demoEmail(username);
    let account;
    try {
        account = await adminAuth().createUser({ email, password: DEMO_PASSWORD, emailVerified: true });
    } catch (err) {
        // Left behind by an interrupted run: reuse it rather than failing.
        if (err.code !== "auth/email-already-exists") throw err;
        account = await adminAuth().getUserByEmail(email);
    }
    return { firebaseUid: account.uid, email, username };
};

const seed = async () => {
    const usernames = makeUsernames(userCount);

    const existing = await User.find({ username: { $in: usernames } }).select("username");
    const existingNames = new Set(existing.map((u) => u.username));
    const toCreate = usernames.filter((u) => !existingNames.has(u));

    if (existingNames.size) {
        console.log(`Skipping ${existingNames.size} demo users that already exist.`);
    }

    const profiles = await mapLimit(toCreate, createDemoUser);
    const users = await User.insertMany(profiles);

    const internships = users.flatMap((u) =>
        Array.from({ length: randInt(3, 12) }, () => buildInternship(u._id))
    );
    await Internship.insertMany(internships);

    console.log(`Created ${users.length} users and ${internships.length} internships.`);
    console.log(`Log in as any of them with the password: ${DEMO_PASSWORD}`);
    console.log(`Sample emails: ${users.slice(0, 3).map((u) => u.email).join(", ")}`);
};

await connect();
try {
    if (has("--wipe-all")) await wipeAll();
    else if (has("--clean")) await clean();
    else await seed();
} catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
