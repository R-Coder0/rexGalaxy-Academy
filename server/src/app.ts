import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";

import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(compression());
  app.use(morgan("dev"));
  app.use(cookieParser());

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  app.use(`/${uploadDir}`, express.static(path.resolve(uploadDir)));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}
