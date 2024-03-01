const express = require('express');
var jwt = require('jsonwebtoken');
// import { Request, Response } from 'express';
import {saveWebhookResponse} from '../controllers/webhookController';

const router = express.Router();

router.post('/responses',saveWebhookResponse);

export default router;