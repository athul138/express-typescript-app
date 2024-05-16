const express = require('express');
var jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { createUser, updateUser, deleteUser, login , createOrder , createPaymentToken , arrayOperationsPackageCheck , blockerCode , nonBlockerCode} from '../controllers/userController';
import UsersController from "../controllers/usersController"
// import {multur} from '../servieces/multurSearviece' 
const router = express.Router();
const usersController = new UsersController();

function authGuard(req:Request, res:Response, next:any) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer <token>"
        let privateKey = process.env.PRIVATEKEY
        try {
            var decoded = jwt.verify(token, privateKey);
            // console.log("decoded--->>>>>>>>",decoded)
        } catch(err) {
            return res.status(401).send('Authorization error');
        }
        // 26 - 5, 21 . 21 - 3.5, 17.5 - pend - 16. 24+16 - 40. 
        // res.send('Authorization token: ' + token);
        next()
    } else {
        return res.status(401).send('Authorization header is missing');
    }
}
router.post('/', createUser);
router.post('/login', login);
router.get('/', usersController.getUsers);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/payment', createOrder);
router.post('/array-ops-check', arrayOperationsPackageCheck);
router.get('/create-payment-token', createPaymentToken);
router.get('/worker-thread', createPaymentToken);
router.get('/blocker',blockerCode);
router.get('/non-blocker',nonBlockerCode);

export default router;




