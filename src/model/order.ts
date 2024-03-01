// models/Item.ts

import { string } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

export interface Order extends Document {
  name: string;
  description: string;
  price: number;
  item_id: mongoose.Types.ObjectId;
  currency: string,
  status: string,
  meta: [Object]
}

const OrderSchema: Schema = new Schema({
  item_id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  order_id: { type: String, required: false },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  method: { type: String, required: false },
  meta: { type: [Object], required: false },
},{ timestamps: true });

export default mongoose.model<Order>('Order', OrderSchema);