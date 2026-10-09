// Throwaway MongoDB for the test run. Started by Playwright's webServer and
// killed when the run ends, so every run begins with an empty database.
import { MongoMemoryServer } from "mongodb-memory-server";

const server = await MongoMemoryServer.create({ instance: { port: 27099, ip: "127.0.0.1" } });
console.log(`In-memory MongoDB ready at ${server.getUri()}`);

const stop = async () => {
  await server.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
