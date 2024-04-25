// routes/itemRoutes.ts
const express = require('express');
import { authorizePaypal , createOrder , confirmOrder , authorizePayment , capturePayment} from '../controllers/paypalController';
const router = express.Router();

router.post('/get-token', authorizePaypal);
router.post('/create-order', createOrder);
router.get('/confirm-order', confirmOrder);
router.get('/authorize-payment', authorizePayment);
router.get('/capture-payment', capturePayment);


export default router;
