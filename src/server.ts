// server.ts

import app from './app';
import { connectDB } from './utils/database';
const Env = require('dotenv')
const cors = require("cors");
// Load environment variables from .env file
const Redis = require("ioredis");

Env.config();

const PORT = process.env.PORT || 3345;
connectDB();


// // Replace with your actual Render Redis URL
// const redisURL = 'redis://red-coefli8l6cac73c3bitg:6379'
// const client = new Redis(redisURL);
// (async () => {
//   try {
//     await client.connect();
//     console.log("Successfully connected to Redis!");
//     await client.quit();
//   } catch (error) {
//     console.error("Error connecting to Redis:", error);
//   }
// })();





// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const redisDemo = async () => {
//   // Connect to Redis at 127.0.0.1, port 6379.
//   const redisClient = new Redis({
//     legacyMode: true ,
//     host: '127.0.0.1',
//     port: 6379,
//   });

//   // Set key "myname" to have value "Simon Prickett".
//   await redisClient.set('myname', 'Simon Prickett');


//   await redisClient.set('myAddress', "state");
//   await redisClient.set('firstName', 'Ath');

//   // Get the value held at key "myname" and log it.
  
//   const value:any = await redisClient.get('myAddress');

// console.log("value ---- >>> ",value)
// // look into redis insight.
  
//   // Disconnect from Redis.
//   redisClient.quit();
// };

// redisDemo();