"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
var jwt = require('jsonwebtoken');
// import { Request, Response } from 'express';
const webhookController_1 = require("../controllers/webhookController");
const router = express.Router();
router.post('/responses', webhookController_1.saveWebhookResponse);
exports.default = router;
