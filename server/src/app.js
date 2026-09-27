import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import paperRoutes from "./routes/papers.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import conferenceRoutes from "./routes/conferences.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim());

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/conferences", conferenceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
