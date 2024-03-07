"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const user_1 = __importDefault(require("./routes/user"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const multer = require("multer");
const app = express();
app.use(express.urlencoded({ extended: true })); // body will not work
app.use(express.json());
// Routes
app.use('/items', itemRoutes_1.default);
app.use('/users', user_1.default);
app.use('/', webhooks_1.default);
exports.default = app;
