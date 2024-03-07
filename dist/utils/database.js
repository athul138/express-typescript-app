"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Env = require('dotenv');
// Load environment variables from .env file
Env.config();
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("process.env.MONGO_URL",process.env.MONGO_URL)
        // console.log("type of ->>>",typeof(process.env.MONGO_URL))
        let mongoURL = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/express-app`;
        try {
            yield mongoose_1.default.connect(mongoURL, { maxPoolSize: 50 });
            console.log('MongoDB Connected');
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    });
}
exports.connectDB = connectDB;
