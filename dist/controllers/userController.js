"use strict";
// controllers/itemController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayOperationsPackageCheck = exports.createPaymentToken = exports.createOrder = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.login = exports.createUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const order_1 = __importDefault(require("../model/order"));
var jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
// import { APIContracts, APIControllers } from 'authorizenet';
let arrayOps = require('array-function-operations');
const redis_1 = require("../utils/redis");
const userValidator_1 = __importDefault(require("../validators/userValidator"));
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
const { hashPassword, matchPassword } = require("../servieces/index");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        let passwordHashed = yield hashPassword((_a = req.body) === null || _a === void 0 ? void 0 : _a.password);
        if (!passwordHashed) {
            return res.status(500).send('Something went wrong');
        }
        const { error } = userValidator_1.default.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        let Users = { name: (_b = req.body) === null || _b === void 0 ? void 0 : _b.name, email: (_c = req.body) === null || _c === void 0 ? void 0 : _c.email, password: passwordHashed };
        const newUser = yield user_1.default.create(Users);
        res.json(newUser);
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == 11000) {
            res.status(422).send(`${(_d = error === null || error === void 0 ? void 0 : error.keyValue) === null || _d === void 0 ? void 0 : _d.email} already exists`);
        }
        else {
            res.status(500).send('Server Error');
        }
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //logic
        // input email and password . 
        // check password match for that email . 
        // if password is matching create a jwt token. return that token.
        const { email, password } = req.body;
        const users = yield user_1.default.findOne({ email: email }, 'email password');
        if (users) {
            let currentPassword = users === null || users === void 0 ? void 0 : users.password;
            let passwordMatch = yield matchPassword(currentPassword, password);
            if (passwordMatch) {
                // generate token and return token 
                let privateKey = process.env.PRIVATEKEY;
                var token = jwt.sign({ email: email, id: users._id }, privateKey, {
                    expiresIn: `${15}d`,
                });
                let data = { email: email, token: token };
                res.status(200).send(data);
            }
            else {
                res.status(422).send('invalid credentails');
            }
        }
        else {
            res.status(404).send('no user found');
        }
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.login = login;
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //implement middleware.
    try {
        const users = yield user_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //implement middleware.
    const { id } = req.params;
    try {
        let redisUserId = `user:${id}`;
        let client = yield (0, redis_1.connectRedis)();
        let redisUser = yield client.hGetAll(redisUserId.toString());
        yield client.flushAll();
        // console.log("redisUser--->>>", redisUser)
        // console.log("typeOf--->>>", typeof(redisUser))
        // console.log("length--->>>", Object.keys(redisUser).length)
        let length = Object.keys(redisUser).length;
        let users = {};
        if (length > 0) {
            users = redisUser;
            console.log("redis-->>>");
        }
        else {
            users = yield user_1.default.findById(id, 'name email createdAt');
            let new_users = {
                name: users.name,
                email: users.email,
                createdAt: users.createdAt.toString()
            };
            yield client.hSet(redisUserId.toString(), new_users);
            yield client.expire(redisUserId.toString(), 1000);
        }
        yield client.disconnect();
        res.json(users);
    }
    catch (error) {
        res.status(500).send(`Server Error----- ${error}`);
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = userValidator_1.default.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const updatedUser = yield user_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser)
            return res.status(404).send('User not found');
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedUser = yield user_1.default.findByIdAndDelete(id);
        if (!deletedUser)
            return res.status(404).send('User not found');
        res.json(deletedUser);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.deleteUser = deleteUser;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        // console.log("jiiiiiiiiiiiiiiiiiiii")
        //LOGIC
        let orderValues = { item_id: (_e = req.body) === null || _e === void 0 ? void 0 : _e.item_id, name: "item1", description: "item1 describtion", price: (_f = req.body) === null || _f === void 0 ? void 0 : _f.price, currency: "INR", status: "PENDING" };
        const orderId = yield order_1.default.create(orderValues);
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
            const response = yield razorpay.orders.create(options);
            // console.log("response", response)
            if (response) {
                yield order_1.default.updateOne({
                    '_id': response.receipt,
                }, {
                    $set: {
                        'status': 'CREATED',
                        'order_id': response.id
                    },
                });
            }
            res.json({
                order_id: response.id,
                currency: response.currency,
                amount: response.amount,
            });
        }
        catch (error) {
            // console.log("error--------------->>>>>",error)
            res.status(400).send(error.message);
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.createOrder = createOrder;
const createPaymentToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    try {
        const { amount } = (_h = (_g = req.body) === null || _g === void 0 ? void 0 : _g.amount) !== null && _h !== void 0 ? _h : 11;
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createPaymentToken = createPaymentToken;
const arrayOperationsPackageCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let arr = ["apple", "apple", "apple", "apple", "apple", "mango", "mango", "mango", "banana", "banana", "grapes", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange"];
        function bulkUpdateArrayElements(arr, elementToUpdate, newElement) {
            let updatedArray = [];
            arr.map((element) => {
                if (element == elementToUpdate) {
                    element = newElement;
                }
                updatedArray.push(element);
            });
            return updatedArray;
        }
        let newArray = bulkUpdateArrayElements(arr, "apple", "apples");
        res.json({ "updatedArray": newArray });
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.arrayOperationsPackageCheck = arrayOperationsPackageCheck;
