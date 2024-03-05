// controllers/itemController.ts

import { Request, Response } from 'express';
import User, { UserInterface } from '../model/user';
import OrderModel from '../model/order';
var jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');


import userSchema from '../validators/userValidator';
import mongoose ,{Types} from 'mongoose';

const { hashPassword, matchPassword } = require("../servieces/index");

export const createUser = async (req: Request, res: Response) => {
    try {
        //LOGIC
        //insert credentials , HASH PASSWORD
        //make email unique

        interface User {
            name: string;
            email: string;
            password: string;
        }

        let passwordHashed = await hashPassword(req.body?.password)
        if (!passwordHashed) {
            return res.status(500).send('Something went wrong')
        }

        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let Users: User = { name: req.body?.name, email: req.body?.email, password: passwordHashed };
        const newUser = await User.create(Users);


        res.json(newUser);
    } catch (error: any) {

        if (error?.code == 11000) {
            res.status(422).send(`${error?.keyValue?.email} already exists`);
        } else {
            res.status(500).send('Server Error');
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        //logic
        // input email and password . 
        // check password match for that email . 
        // if password is matching create a jwt token. return that token.

        const { email, password } = req.body
        const users = await User.findOne({ email: email }, 'email password');

        if (users) {
            let currentPassword = users?.password
            let passwordMatch = await matchPassword(currentPassword, password)
            if (passwordMatch) {

                // generate token and return token 
                let privateKey = process.env.PRIVATEKEY

                var token = jwt.sign({ email: email, id: users._id }, privateKey, {
                    expiresIn: `${15}d`,
                });

                let data = { email: email, token: token }

                res.status(200).send(data);
            } else {
                res.status(422).send('invalid credentails');
            }

        } else {
            res.status(404).send('no user found');
        }

    } catch (error) {
        res.status(500).send('Server Error');
    }
};


export const getUsers = async (_req: Request, res: Response) => {
    //implement middleware.
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) return res.status(404).send('User not found');

        res.json(updatedUser);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).send('User not found');

        res.json(deletedUser);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {

        console.log("jiiiiiiiiiiiiiiiiiiii")
        //LOGIC

        let orderValues: any = { item_id: req.body?.item_id, name: "item1", description: "item1 describtion", price: req.body?.price, currency: "INR", status: "PENDING" }
        const orderId = await OrderModel.create(orderValues);

        var razorpay = new Razorpay({
            key_id: 'rzp_test_xrqyfoB53WzmUC',
            key_secret: 'SpLdPooUSgvDEQNioh9dePCs',
        });

        const options = {
            amount: parseInt(orderValues.price) * 100,
            currency: orderValues.currency,
            receipt: orderId._id
            // order_capture: 1
        };

        console.log("pazsfd",options)

        try {
            const response = await razorpay.orders.create(options)
            console.log("response", response)
            if (response) {

                await OrderModel.updateOne(
                    {
                      '_id': response.receipt,
                    },
                    {
                      $set: {
                        'status': 'CREATED', 
                        'order_id':  response.id
                      },
                    }
                  )
            }

            res.json({
                order_id: response.id,
                currency: response.currency,
                amount: response.amount,
            })
        } catch (error:any) {
            console.log("error--------------->>>>>",error)
            res.status(400).send(error.message);
        }


        //      3 35 . 6 15
        // 2 25             1 45
        //         4   0




    } catch (error: any) {
        res.status(500).send(error.message);
    }
};