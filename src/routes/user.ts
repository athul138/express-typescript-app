const express = require('express');
var jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { createUser, getUsers, updateUser, deleteUser, login , createOrder} from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);



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



router.post('/login', login);
router.get('/', [authGuard, getUsers]);
// router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/payment', createOrder);

export default router;