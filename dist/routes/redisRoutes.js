"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/itemRoutes.ts
const express = require('express');
const redisController_1 = require("../controllers/redisController");
const router = express.Router();
router.get('/api/data', redisController_1.checkCache);
exports.default = router;
