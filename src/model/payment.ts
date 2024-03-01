// models/Item.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface Payment extends Document {
  name: string;
  description: string;
  price: number;
  item_id:mongoose.Types.ObjectId;
  currency:string,
  status:string,
  meta:[Object]
}

const PaymentSchema: Schema = new Schema({
  item_id:{ type: mongoose.Types.ObjectId, required: true }, 
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  currency : { type: String, required: true },
  status : { type: String, required: true },
  method:{type:String,  required : false},
  meta:{ type: [Object], required: false },
});

export default mongoose.model<Payment>('Payment', PaymentSchema);