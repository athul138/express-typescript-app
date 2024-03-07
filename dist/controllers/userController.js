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
exports.createOrder = exports.deleteUser = exports.updateUser = exports.getUsers = exports.login = exports.createUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const order_1 = __importDefault(require("../model/order"));
var jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const userValidator_1 = __importDefault(require("../validators/userValidator"));
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
            key_id: 'rzp_test_xrqyfoB53WzmUC',
            key_secret: 'SpLdPooUSgvDEQNioh9dePCs',
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
