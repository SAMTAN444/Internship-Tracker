/**
 * Upgrades a pre-Firebase (username + password) account in place, so its
 * internships survive the move to Firebase Auth.
 *
 *   node scripts/link-legacy-user.js --uri "<MONGO_URI>" --username samuel --email you@example.com
 *   ... --yes                       # actually write (default is a dry run)
 *   ... --yes --delete-other-legacy # also remove every other old-style account
 *
 * What it does:
 *   1. Finds the old user by username (one without a firebaseUid).
 *   2. Finds or creates the Firebase account for --email.
 *   3. Writes firebaseUid + email onto the old user document and drops the
 *      old password / refresh-token fields. Its _id is unchanged, so every
 *      internship stays attached.
 *   4. Prints a link to set the password (new Firebase accounts have none).
 *
 * Old-style users have no firebaseUid. Leaving several behind blocks the
 * unique index on firebaseUid, hence --delete-other-legacy.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { adminAuth } from "../config/firebase.js";

dotenv.config();

const arg = (flag) => {
    const i = process.argv.indexOf(flag);
    return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : null;
};
const has = (flag) => process.argv.includes(flag);

const uri = arg("--uri");
const username = arg("--username");
const email = arg("--email")?.trim().toLowerCase();
const write = has("--yes");
const deleteOthers = has("--delete-other-legacy");

if (!uri || !username || !email) {
    console.error('Usage: node scripts/link-legacy-user.js --uri "<MONGO_URI>" --username <name> --email <email> [--yes] [--delete-other-legacy]');
    process.exit(1);
}

// Raw collections, not the Mongoose models: the old documents don't match
// the new User schema (no firebaseUid/email, extra password field).
await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
const db = mongoose.connection.db;
const users = db.collection("users");
const internships = db.collection("internships");
const legacy = { firebaseUid: { $exists: false } };

console.log(`Database: "${db.databaseName}"`);
console.log(`Users: ${await users.countDocuments()} (${await users.countDocuments(legacy)} old-style)`);
console.log(`Internships: ${await internships.countDocuments()}`);

try {
    const user = await users.findOne({ username });
    if (!user) throw new Error(`No user named "${username}" in this database.`);
    if (user.firebaseUid) throw new Error(`"${username}" is already linked to a Firebase account (${user.email}).`);

    const theirs = await internships.countDocuments({ user: user._id });
    console.log(`\nFound "${username}" (${user._id}) with ${theirs} internships.`);

    const others = await users.find({ ...legacy, _id: { $ne: user._id } }).project({ username: 1 }).toArray();
    const othersInternships = await internships.countDocuments({ user: { $in: others.map((u) => u._id) } });
    if (others.length) {
        console.log(
            `Other old-style accounts: ${others.length} (${othersInternships} internships): ` +
                others.slice(0, 10).map((u) => u.username).join(", ") +
                (others.length > 10 ? ", …" : "")
        );
    }

    if (!write) {
        console.log(`\nDry run: nothing changed. Re-run with --yes to link "${username}" to ${email}` +
            (others.length ? ", and add --delete-other-legacy to remove the other old accounts." : "."));
    } else {
        let account;
        let created = false;
        try {
            account = await adminAuth().getUserByEmail(email);
        } catch (err) {
            if (err.code !== "auth/user-not-found") throw err;
            account = await adminAuth().createUser({ email });
            created = true;
        }

        if (await users.findOne({ firebaseUid: account.uid })) {
            throw new Error(`${email} already has a Trackly profile. Delete that account in Firebase first, or use another email.`);
        }

        await users.updateOne(
            { _id: user._id },
            { $set: { firebaseUid: account.uid, email }, $unset: { password: "", refreshTokens: "" } }
        );
        console.log(`\nLinked "${username}" to ${email} (${created ? "new" : "existing"} Firebase account). ${theirs} internships kept.`);

        if (created) {
            const link = await adminAuth().generatePasswordResetLink(email);
            console.log(`\nSet your password here, then log in with ${email}:\n${link}`);
        }

        if (deleteOthers && others.length) {
            const ids = others.map((u) => u._id);
            const { deletedCount: i } = await internships.deleteMany({ user: { $in: ids } });
            const { deletedCount: u } = await users.deleteMany({ _id: { $in: ids } });
            console.log(`Removed ${u} other old-style accounts and ${i} of their internships.`);
        }
    }
} catch (err) {
    console.error("\n" + err.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
