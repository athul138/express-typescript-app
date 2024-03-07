"use strict";
// server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./utils/database");
const Env = require('dotenv');
const cors = require("cors");
// Load environment variables from .env file
Env.config();
const PORT = process.env.PORT || 3345;
(0, database_1.connectDB)();
// Start server
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
