import mongoose from 'mongoose';
const Env = require('dotenv')
// Load environment variables from .env file
Env.config();

export async function connectDB() {

    // console.log("process.env.MONGO_URL",process.env.MONGO_URL)
    // console.log("type of ->>>",typeof(process.env.MONGO_URL))
    let mongoURL:string = process.env.MONGO_URL ||  `mongodb://0.0.0.0:27017/express-app`
  try {
    await mongoose.connect(mongoURL, { maxPoolSize: 50 });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}