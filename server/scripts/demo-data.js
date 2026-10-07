/**
 * Fixture data for scripts/seed.js.
 */

export const DEMO_PREFIX = "demo_";
export const DEMO_PASSWORD = "Password1!"; // satisfies the Firebase password policy

// Demo accounts log in with email; example.com never delivers mail.
export const demoEmail = (username) => `${username}@example.com`;

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

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const daysAhead = (n) => new Date(Date.now() + n * 86400000);

/** Generates `count` unique demo usernames. */
export const makeUsernames = (count) => {
    const names = new Set();
    while (names.size < count) {
        const n = names.size + 1;
        names.add(`${DEMO_PREFIX}${pick(FIRST_NAMES)}${pick(LAST_INITIALS)}${n}`);
    }
    return [...names];
};

/** Builds one internship owned by `userId`. */
export const buildInternship = (userId) => {
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
