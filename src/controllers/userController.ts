// controllers/itemController.ts

import { Request, Response } from 'express';
import User, { UserInterface } from '../model/user';
var jwt = require('jsonwebtoken');

import userSchema from '../validators/userValidator';

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
    } catch (error:any) {

        if(error?.code == 11000){
            res.status(422).send(`${error?.keyValue?.email} already exists`);
        }else{
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
