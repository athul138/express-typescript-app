"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capturePayment = exports.authorizePayment = exports.confirmOrder = exports.createOrder = exports.authorizePaypal = void 0;
const authorizePaypal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let data = req.body;
        let clientId = data === null || data === void 0 ? void 0 : data.clientId;
        let clientSecret = data === null || data === void 0 ? void 0 : data.clientSecret;
        const body = 'grant_type=client_credentials';
        const headers = new Headers({
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: 'POST',
            headers,
            body
        })
            .then(response => response.json())
            .then(data => {
            console.log(data); // Process the access token response
            res.json(data);
        })
            .catch(error => {
            console.error(error); // Handle errors
            res.json(error);
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == 11000) {
            res.status(422).send(`${(_a = error === null || error === void 0 ? void 0 : error.keyValue) === null || _a === void 0 ? void 0 : _a.email} already exists`);
        }
        else {
            res.status(500).send('Server Error');
        }
    }
});
exports.authorizePaypal = authorizePaypal;
// create order 
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        let AUTHORIZATION = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization;
        let order_id = req.body.order_id;
        let item_name = req.body.item_name;
        const randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'PayPal-Request-Id': `req-${randomNumber}`,
                'Authorization': `${AUTHORIZATION}`
            },
            body: JSON.stringify({
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "reference_id": `${order_id}`,
                        "amount": { "currency_code": "USD", "value": "100.00" },
                    }
                ],
                "payment_source": {
                    "paypal": {
                        "experience_context": {
                            "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                            "brand_name": `${item_name}`,
                            "locale": "en-US",
                            "landing_page": "LOGIN",
                            "shipping_preference": "NO_SHIPPING",
                            "user_action": "PAY_NOW",
                            "return_url": "https://example.com/returnUrl",
                            "cancel_url": "https://example.com/cancelUrl"
                        }
                    }
                }
            })
        })
            .then(response => response.json())
            .then(data => {
            console.log(data); // Process the access token response
            res.json(data);
        })
            .catch(error => {
            console.error(error); // Handle errors
            res.json(error);
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == 11000) {
            res.status(422).send(`${(_c = error === null || error === void 0 ? void 0 : error.keyValue) === null || _c === void 0 ? void 0 : _c.email} already exists`);
        }
        else {
            res.status(500).send('Server Error');
        }
    }
});
exports.createOrder = createOrder;
// create order 
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j, _k;
    try {
        let AUTHORIZATION = (_d = req === null || req === void 0 ? void 0 : req.headers) === null || _d === void 0 ? void 0 : _d.authorization;
        let first_name = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.first_name;
        let last_name = (_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.last_name;
        let email = (_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.email;
        let item_name = (_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.item_name;
        let order_id = (_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.order_id;
        fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${order_id}/confirm-payment-source`, {
            method: 'POST',
            headers: {
                'Authorization': `${AUTHORIZATION}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "payment_source": {
                    "paypal": {
                        "name": {
                            "given_name": `${first_name}`,
                            "surname": `${last_name}`
                        },
                        "email_address": `${email}`,
                        "experience_context": {
                            "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                            "brand_name": `${item_name}`,
                            "locale": "en-US",
                            "landing_page": "LOGIN",
                            "shipping_preference": "NO_SHIPPING",
                            "user_action": "PAY_NOW",
                            "return_url": "https://example.com/returnUrl",
                            "cancel_url": "https://example.com/cancelUrl"
                        }
                    }
                }
            })
        })
            .then(response => response.json())
            .then(data => {
            console.log(data); // Process the access token response.
            res.json(data);
        })
            .catch(error => {
            console.error(error); // Handle errors.
            res.json(error);
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == 11000) {
            res.status(422).send(`${(_k = error === null || error === void 0 ? void 0 : error.keyValue) === null || _k === void 0 ? void 0 : _k.email} already exists`);
        }
        else {
            res.status(500).send('Server Error');
        }
    }
});
exports.confirmOrder = confirmOrder;
// no needed
const authorizePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        // get access token.
        let ACCESS_TOKEN = 'A21AAKnOOIPikIm-4TADLiYFwh7Vt0A5u820Q1yyRKkw2SlxXYtWy9COPddWtEDEeGjp2BqqE9cmiw2tHJ8R73uwPOWw-5g4A';
        fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders/4GB162610A8686505/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'PayPal-Request-Id': 'req-40-00',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
            .then(response => response.json())
            .then(data => {
            console.log(data); // Process the authorization response.
        })
            .catch(error => {
            console.error(error); // Handle errors.
            // Mean if client raises any issues will look into that.
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == 11000) {
            res.status(422).send(`${(_l = error === null || error === void 0 ? void 0 : error.keyValue) === null || _l === void 0 ? void 0 : _l.email} already exists`);
        }
        else {
            res.status(500).send('Server Error');
        }
    }
});
exports.authorizePayment = authorizePayment;
const capturePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p;
    try {
        // get access token
        let AUTHORIZATION = (_m = req === null || req === void 0 ? void 0 : req.headers) === null || _m === void 0 ? void 0 : _m.authorization;
        let order_id = (_o = req === null || req === void 0 ? void 0 : req.body) === null || _o === void 0 ? void 0 : _o.order_id;
        fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${order_id}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'PayPal-Request-Id': 'req-4426861273502083',
                'Authorization': `${AUTHORIZATION}`
            }
        })
            .then(response => response.json())
            .then(data => {
            console.log(data); // Process the authorization response.
        })
            .catch(error => {
            console.error(error); // Handle errors.
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == 11000) {
            res.status(422).send(`${(_p = error === null || error === void 0 ? void 0 : error.keyValue) === null || _p === void 0 ? void 0 : _p.email} already exists`);
        }
        else {
            res.status(500).send('Server Error');
        }
    }
});
exports.capturePayment = capturePayment;
