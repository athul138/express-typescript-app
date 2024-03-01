// models/Item.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface Webhook extends Document {
  event: string
  meta:[Object]
}

const WebhookSchema: Schema = new Schema({
  event:{ type: String, required: true }, 
  meta:{ type: [Object], required: false },
},{ timestamps: true });

export default mongoose.model<Webhook>('Webhook', WebhookSchema);