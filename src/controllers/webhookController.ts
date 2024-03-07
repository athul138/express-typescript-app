// controllers/itemController.ts

import { Request, Response } from 'express';
import webhookEvents from '../model/webhook-events';
// import Item from '../model/item';
// import  itemSchema  from '../validators/itemValidator';


export const saveWebhookResponse = async (req: Request, res: Response) => {
    try {

        let data:any = {
            event:req.body?.event,
            meta:req.body
        }
       let webhookResponse = await webhookEvents.create(data)
        res.status(200).send(req.body);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};



