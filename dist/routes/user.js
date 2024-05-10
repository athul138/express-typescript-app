"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
var jwt = require('jsonwebtoken');
const userController_1 = require("../controllers/userController");
const usersController_1 = __importDefault(require("../controllers/usersController"));
// import {multur} from '../servieces/multurSearviece' 
const router = express.Router();
const usersController = new usersController_1.default();
function authGuard(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer <token>"
        let privateKey = process.env.PRIVATEKEY;
        try {
            var decoded = jwt.verify(token, privateKey);
            // console.log("decoded--->>>>>>>>",decoded)
        }
        catch (err) {
            return res.status(401).send('Authorization error');
        }
        // 26 - 5, 21 . 21 - 3.5, 17.5 - pend - 16. 24+16 - 40. 
        // res.send('Authorization token: ' + token);
        next();
    }
    else {
        return res.status(401).send('Authorization header is missing');
    }
}
router.post('/', userController_1.createUser);
router.post('/login', userController_1.login);
router.get('/', usersController.getUsers);
router.put('/:id', userController_1.updateUser);
router.delete('/:id', userController_1.deleteUser);
router.post('/payment', userController_1.createOrder);
router.get('/array-ops-check', userController_1.arrayOperationsPackageCheck);
router.get('/create-payment-token', userController_1.createPaymentToken);
exports.default = router;
