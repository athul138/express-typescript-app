// routes/itemRoutes.ts
const express = require('express');
import { getRabbitMQData } from '../controllers/rabbitMqController';
// const { connectToRabbitMQ } = require('./utils/rabbitMq');

const router = express.Router();

router.get('/get-deliveries', getRabbitMQData);

export default router;
