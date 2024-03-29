// models/Item.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description: string;
  price: number;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [Object], required: false },
},{ timestamps: true });

export default mongoose.model<IItem>('Item', ItemSchema);