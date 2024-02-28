// server.ts

import app from './app';
import { connectDB } from './utils/database';
const Env = require('dotenv')
const cors = require("cors");
// Load environment variables from .env file
Env.config();

const PORT = process.env.PORT || 3345;


connectDB();



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});