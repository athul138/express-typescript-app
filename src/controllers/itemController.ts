// controllers/itemController.ts

import { Request, Response } from 'express';
import Item from '../model/item';
import itemSchema from '../validators/itemValidator';

export const createItem = async (req: any, res: Response) => {
  try {
    const { error } = itemSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let data: any = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    }

    if (req.files.length > 0) {
      data.images = req.files
    }

    const newItem = await Item.create(data);
    res.json(newItem);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export const getItems = async (_req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = itemSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.status(404).send('Item not found');
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).send('Item not found');

    res.json(deletedItem);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
