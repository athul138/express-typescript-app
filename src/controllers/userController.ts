// controllers/itemController.ts

import { Request, Response } from 'express';
import User, { UserInterface } from '../model/user';
import OrderModel from '../model/order';
var jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
// import { APIContracts, APIControllers } from 'authorizenet';
let arrayOps = require('array-function-operations');
const { Worker } = require('worker_threads')



import userSchema from '../validators/userValidator';
import mongoose, { Types } from 'mongoose';
// import UserRepository from '../repository/UserRepository';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;


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


// export const getUsers = async (_req: Request, res: Response) => {
//     //implement middleware.
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// };

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

        // console.log("jiiiiiiiiiiiiiiiiiiii")
        //LOGIC

        let orderValues: any = { item_id: req.body?.item_id, name: "item1", description: "item1 describtion", price: req.body?.price, currency: "INR", status: "PENDING" }
        const orderId = await OrderModel.create(orderValues);

        var razorpay = new Razorpay({
            key_id: 'rzp_test_xrqyfoB53WzmUC+1', //remove +1
            key_secret: 'SpLdPooUSgvDEQNioh9dePCs+1',
        });

        const options = {
            amount: parseInt(orderValues.price) * 100,
            currency: orderValues.currency,
            receipt: orderId._id
            // order_capture: 1
        };

        // console.log("pazsfd",options)

        try {
            const response = await razorpay.orders.create(options)
            // console.log("response", response)
            if (response) {

                await OrderModel.updateOne(
                    {
                        '_id': response.receipt,
                    },
                    {
                        $set: {
                            'status': 'CREATED',
                            'order_id': response.id
                        },
                    }
                )
            }

            res.json({
                order_id: response.id,
                currency: response.currency,
                amount: response.amount,
            })
        } catch (error: any) {
            // console.log("error--------------->>>>>",error)
            res.status(400).send(error.message);
        }

    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export const createPaymentToken = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body?.amount ?? 11;

        var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName('67Kx3R5rHz');
        merchantAuthenticationType.setTransactionKey('48Q568j8Sm6S3aeu');

        var transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setAmount(100);

        var setting1 = new ApiContracts.SettingType();
        setting1.setSettingName('hostedPaymentButtonOptions');
        setting1.setSettingValue('{\"text\": \"Pay\"}');

        var setting2 = new ApiContracts.SettingType();
        setting2.setSettingName('hostedPaymentOrderOptions');
        setting2.setSettingValue('{\"show\": false}');

        var settingList = [];
        settingList.push(setting1);
        settingList.push(setting2);

        var alist = new ApiContracts.ArrayOfSetting();
        alist.setSetting(settingList);

        var getRequest = new ApiContracts.GetHostedPaymentPageRequest();
        getRequest.setMerchantAuthentication(merchantAuthenticationType);
        getRequest.setTransactionRequest(transactionRequestType);
        getRequest.setHostedPaymentSettings(alist);

        var ctrl = new ApiControllers.GetHostedPaymentPageController(getRequest.getJSON());

        ctrl.execute(function () {

            var apiResponse = ctrl.getResponse();

            var response = new ApiContracts.GetHostedPaymentPageResponse(apiResponse);

            //pretty print response
            //console.log(JSON.stringify(response, null, 2));

            if (response != null) {

                if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                    console.log(response.getToken());
                }
                else {
                    //console.log('Result Code: ' + response.getMessages().getResultCode());
                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                }
            }
            else {
                console.log('Null response received');
            }

        });

        res.status(500).json({ message: 'Internal server error' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const arrayOperationsPackageCheck = async (req: Request, res: Response) => {
    try {

        console.log("body------>>", req.body)
        let body = req.body
        let newArray = await arrayOps.sum(body.array)

        // let arr = ["apple", "apple", "apple", "apple", "apple", "mango", "mango", "mango", "banana", "banana", "grapes", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange"]
        // function bulkUpdateArrayElements(arr: any, elementToUpdate: string, newElement: string) {
        //     let updatedArray: any = []
        //     arr.map((element: any) => {
        //         if (element == elementToUpdate) {
        //             element = newElement
        //         }
        //         updatedArray.push(element)
        //     })
        //     return updatedArray
        // }
        // let newArray = bulkUpdateArrayElements(arr, "apple", "apples")

        res.json({ "updatedArray": newArray })


    } catch (error) {

        console.log("error------->>", error)
        res.status(500).send('Server Error');
    }
};

/**
 * getUsers
 */
// export const getUsers = async (req:Request,res:Response) => {

//     console.log("hi")

//     const userRepository = new UserRepository();
//     // let Repository:any = ''
//     let Repository:any = await userRepository.getUsers()
//     res.json(Repository)

// }

export const blockerCode = async (req: Request, res: Response) => {

    console.log("start thread----------->>>>")

    let worker = new Worker("../express-app/src/servieces/worker.ts");

    worker.on("message", (data:any)=>{
        console.log(`result is ${data}`)
        res.send(`result is ${data}`).status(200)
    })

    worker.on("error", (error:any)=>{
        console.log(`an error occured :- ${error}`)
        res.send(`an error occured :- ${error}`).status(404)
    })

    // let counter = 0
    // for( let i=0; i<20000000000000000000000000000000; i++ ){
    //     counter++
    // }

    // res.send(`final counter value is ${counter}`).status(404)

}

export const nonBlockerCode = async (req: Request, res: Response) => {

    let Repository = "response"
    res.json(Repository).status(200)

}
