import "dotenv/config";
import app from "./src/app.js";
import { prisma } from "./src/lib/prisma.js";

const port = Number(process.env.PORT || 5000);

const server = app.listen(port, () => {
  console.log(`IntelliPaper API listening on http://localhost:${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing API server.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
