import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { connectDB } from "./config/db";

async function bootstrap() {
  const PORT = Number(process.env.PORT || 5000);
  const MONGO_URI = process.env.MONGO_URI as string;

  if (!MONGO_URI) throw new Error("MONGO_URI missing in .env");

  await connectDB(MONGO_URI);

  const app = createApp();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
