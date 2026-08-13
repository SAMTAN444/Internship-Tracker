/**
 * Seeds demo users and internships.
 *
 *   node scripts/seed.js                    # seed using MONGO_URI from .env
 *   node scripts/seed.js --uri "mongodb+srv://..."
 *   node scripts/seed.js --users 60         # how many demo users (default 60)
 *   node scripts/seed.js --clean            # remove everything this script created
 *
 * Everything it creates is namespaced under the DEMO_PREFIX username prefix, so
 * --clean can remove exactly the seeded data and nothing else. Writing to a
 * non-localhost database requires --yes.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Internship from "../models/Internship.js";

dotenv.config();

const DEMO_PREFIX = "demo_";
const DEMO_PASSWORD = "Password1!"; // satisfies the register endpoint's strength rules

const arg = (flag, fallback = null) => {
    const i = process.argv.indexOf(flag);
    return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")
        ? process.argv[i + 1]
        : fallback;
};
const has = (flag) => process.argv.includes(flag);

const uri = arg("--uri", process.env.MONGO_URI);
const userCount = Number(arg("--users", 60));

const FIRST_NAMES = [
    "alex", "brianna", "caleb", "denise", "elliot", "farah", "gavin", "hana",
    "isaac", "jolene", "kelvin", "lena", "marcus", "nadia", "owen", "priya",
    "quentin", "rachel", "samir", "tessa", "umar", "vivian", "wesley", "xinyi",
    "yusuf", "zoe", "amelia", "bryan", "chloe", "darren",
];
const LAST_INITIALS = "abcdefghijklmnopqrstuvwxyz".split("");

const COMPANIES = [
    "Shopee", "Grab", "GovTech", "DBS Bank", "Sea Group", "TikTok", "Stripe",
    "Google", "Meta", "Jane Street", "Optiver", "Citadel", "Visa", "Micron",
    "ST Engineering", "Autodesk", "Palantir", "Airbnb", "Bytedance", "OCBC",
    "UOB", "Razer", "Zendesk", "Salesforce", "Amazon", "Microsoft", "Nvidia",
    "Ninja Van", "Carousell", "Circles.Life",
];
const ROLES = [
    "Software Engineer Intern", "Backend Engineer Intern", "Frontend Engineer Intern",
    "Data Engineer Intern", "Machine Learning Intern", "DevOps Intern",
    "Security Engineer Intern", "Product Manager Intern", "Quantitative Trader Intern",
    "Full Stack Developer Intern", "Site Reliability Engineer Intern", "Data Analyst Intern",
];
const STATUSES = ["Applied", "OA", "Interview", "Offer", "Rejected", "Archived"];
const CYCLES = ["Spring", "Summer", "Fall", "Winter", "6-Month"];
const NOTES = [
    "Referred by a senior from school.",
    "Recruiter said to expect an OA within two weeks.",
    "Two rounds: one technical, one behavioural.",
    "Heavy on dynamic programming — revise before the next round.",
    "Team works on payments infrastructure.",
    "Asked about my final year project in detail.",
    "Compensation discussed: above market for the cycle.",
    "",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const daysAhead = (n) => new Date(Date.now() + n * 86400000);

const buildInternship = (userId) => {
    const status = pick(STATUSES);
    const doc = {
        user: userId,
        company: pick(COMPANIES),
        role: pick(ROLES),
        status,
        cycle: pick(CYCLES),
        appliedAt: daysAgo(randInt(1, 300)),
        applicationLink: "https://example.com/careers/" + randInt(10000, 99999),
        notes: pick(NOTES),
    };

    // Only pending stages carry a reminder, matching how the app uses them.
    if ((status === "OA" || status === "Interview") && Math.random() < 0.6) {
        doc.reminder = {
            type: status,
            remindAt: daysAhead(randInt(1, 21)),
            location: status === "Interview" ? pick(["Zoom", "On-site", "Google Meet"]) : "HackerRank",
        };
    }
    return doc;
};

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

const clean = async () => {
    const users = await User.find({ username: new RegExp("^" + DEMO_PREFIX) }).select("_id");
    const ids = users.map((u) => u._id);
    const { deletedCount: internships } = await Internship.deleteMany({ user: { $in: ids } });
    const { deletedCount: removed } = await User.deleteMany({ _id: { $in: ids } });
    console.log(`Removed ${removed} demo users and ${internships} internships.`);
};

const seed = async () => {
    // One hash reused across demo accounts — bcrypt is slow by design and these
    // all share the same throwaway password anyway.
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    const usernames = new Set();
    while (usernames.size < userCount) {
        const n = usernames.size + 1;
        usernames.add(`${DEMO_PREFIX}${pick(FIRST_NAMES)}${pick(LAST_INITIALS)}${n}`);
    }

    const existing = await User.find({ username: { $in: [...usernames] } }).select("username");
    const existingNames = new Set(existing.map((u) => u.username));
    const toCreate = [...usernames].filter((u) => !existingNames.has(u));

    if (existingNames.size) {
        console.log(`Skipping ${existingNames.size} demo users that already exist.`);
    }

    const users = await User.insertMany(
        toCreate.map((username) => ({ username, password: passwordHash, refreshTokens: [] }))
    );

    const internships = users.flatMap((u) =>
        Array.from({ length: randInt(3, 12) }, () => buildInternship(u._id))
    );
    await Internship.insertMany(internships);

    console.log(`Created ${users.length} users and ${internships.length} internships.`);
    console.log(`Log in as any of them with the password: ${DEMO_PASSWORD}`);
    console.log(`Sample usernames: ${users.slice(0, 3).map((u) => u.username).join(", ")}`);
};

await connect();
try {
    if (has("--clean")) await clean();
    else await seed();
} catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
