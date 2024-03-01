import mongoose, { Schema, Document } from 'mongoose';
// Define MongoDB Schema and Model

export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
  }
  
  const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique :true },
    password: { type: String, required: true },
  },{ timestamps: true });
  
  export default mongoose.model<UserInterface>('User', UserSchema);