"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/itemRoutes.ts
const express = require('express');
const paypalController_1 = require("../controllers/paypalController");
const router = express.Router();
router.post('/get-token', paypalController_1.authorizePaypal);
router.post('/create-order', paypalController_1.createOrder);
router.get('/confirm-order', paypalController_1.confirmOrder);
router.get('/authorize-payment', paypalController_1.authorizePayment);
router.get('/capture-payment', paypalController_1.capturePayment);
exports.default = router;
