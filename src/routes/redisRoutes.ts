// routes/itemRoutes.ts
const express = require('express');
import { createRedisDatas , getRedisDatas , postRedisDatas} from '../controllers/redisController';
const router = express.Router();

router.get('/create-redis', createRedisDatas);
router.post('/post-redis', postRedisDatas);
router.get('/get-redis', getRedisDatas);

export default router;
