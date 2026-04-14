"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const db_1 = require("./config/db");
async function bootstrap() {
    const PORT = Number(process.env.PORT || 5000);
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI)
        throw new Error("MONGO_URI missing in .env");
    await (0, db_1.connectDB)(MONGO_URI);
    const app = (0, app_1.createApp)();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
bootstrap().catch((e) => {
    console.error(e);
    process.exit(1);
});
