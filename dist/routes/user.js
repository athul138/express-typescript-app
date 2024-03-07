"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
var jwt = require('jsonwebtoken');
const userController_1 = require("../controllers/userController");
// import {multur} from '../servieces/multurSearviece' 
const router = express.Router();
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
router.get('/', [authGuard, userController_1.getUsers]);
router.put('/:id', userController_1.updateUser);
router.delete('/:id', userController_1.deleteUser);
router.post('/payment', userController_1.createOrder);
exports.default = router;
