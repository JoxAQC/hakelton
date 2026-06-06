import "dotenv/config";
import express from "express";
import cors from "cors";
import { chatRouter } from "./routes/chat.js";
import { ingestRouter } from "./routes/ingest.js";
import { queryRouter } from "./routes/query.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { reportsRouter } from "./routes/reports.js";
import { onboardRouter } from "./routes/onboard.js";
import { authRouter } from "./routes/auth.js";
import { validateApiKey } from "./middleware/api-key.js";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3001")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "X-API-Key"],
  })
);

app.use(express.json({ limit: "50mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "hakelton-backend", timestamp: new Date().toISOString() });
});

app.use("/api/chat", chatRouter);
app.use("/api/ingest", validateApiKey, ingestRouter);
app.use("/api/query", validateApiKey, queryRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/onboard", onboardRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`[hakelton-backend] listening on :${PORT}`);
});
