import { Request, Response } from 'express';


export const authorizePaypal = async (req: Request, res: Response) => {
    try {

        let data = req.body
        let clientId = data?.clientId
        let clientSecret = data?.clientSecret

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


    } catch (error: any) {

        if (error?.code == 11000) {
            res.status(422).send(`${error?.keyValue?.email} already exists`);
        } else {
            res.status(500).send('Server Error');
        }
    }
};

// create order 
export const createOrder = async (req: Request, res: Response) => {
    try {

        let AUTHORIZATION = req?.headers?.authorization
        let order_id = req.body.order_id
        let item_name = req.body.item_name
        
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
                    }],
                "payment_source": {
                    "paypal": {
                        "experience_context": {
                            "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                            "brand_name": `${item_name}`,
                            "locale": "en-US",
                            "landing_page": "LOGIN",
                            "shipping_preference": "NO_SHIPPING",  //when no shipping address is needed
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


    } catch (error: any) {

        if (error?.code == 11000) {
            res.status(422).send(`${error?.keyValue?.email} already exists`);
        } else {
            res.status(500).send('Server Error');
        }
    }
};

// create order 
export const confirmOrder = async (req: Request, res: Response) => {
    try {

        let AUTHORIZATION = req?.headers?.authorization
        let first_name = req?.body?.first_name
        let last_name = req?.body?.last_name
        let email = req?.body?.email
        let item_name = req?.body?.item_name
        let order_id = req?.body?.order_id

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
                        "email_address": `${email}`, // Email address of buyer not our.
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

    } catch (error: any) {

        if (error?.code == 11000) {
            res.status(422).send(`${error?.keyValue?.email} already exists`);
        } else {
            res.status(500).send('Server Error');
        }
    }
};

// no needed
export const authorizePayment = async (req: Request, res: Response) => {
    try {

        // get access token.
        let ACCESS_TOKEN = 'A21AAKnOOIPikIm-4TADLiYFwh7Vt0A5u820Q1yyRKkw2SlxXYtWy9COPddWtEDEeGjp2BqqE9cmiw2tHJ8R73uwPOWw-5g4A'

        fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders/4GB162610A8686505/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'PayPal-Request-Id': 'req-40-00', // Request ID from create order.
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


    } catch (error: any) {

        if (error?.code == 11000) {
            res.status(422).send(`${error?.keyValue?.email} already exists`);
        } else {
            res.status(500).send('Server Error');
        }
    }
};

export const capturePayment = async (req: Request, res: Response) => {
    try {
        // get access token
        let AUTHORIZATION = req?.headers?.authorization
        let order_id = req?.body?.order_id

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

    } catch (error: any) {

        if (error?.code == 11000) {
            res.status(422).send(`${error?.keyValue?.email} already exists`);
        } else {
            res.status(500).send('Server Error');
        }
    }
};
