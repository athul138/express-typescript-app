// routes/itemRoutes.ts
const express = require('express');
import {checkCache} from '../controllers/redisController';
const router = express.Router();

router.get('/api/data', checkCache);

export default router;

