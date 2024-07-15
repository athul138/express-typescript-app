// controllers/itemController.ts

import { Request, Response } from 'express';
const { connectToRabbitMQ } = require('../utils/rabbitMq');

export const getRabbitMQData = async (req: Request, res: Response) => {


    try {
        // Connect to RabbitMQ and consume order updates
        const { connection, channel, test } = await connectToRabbitMQ();

        // console.log(`hi ${test} is here`)

        const consumeMessage = () => { // reading message 
            return new Promise((resolve, reject) => {

                const queue = 'delivery-queue';
                channel.consume(queue, (message: any) => {
                    const content = message;

                    resolve(content);

                }, { noAck: false }); // if message is not acknowledged message will be stored in the queue. //default will be acknowledged

            });
        }

        await consumeMessage()
            .then(content => {
                res.json({ success: true, message: `Content for receiver is ${JSON.stringify(content)}` });
            })
            .catch(error => {
                res.json({ success: false, message: `Failed to consume message: ${error.message}` });
            });


    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        process.exit(1);
    }

};
