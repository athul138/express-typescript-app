const  express = require('express');
import itemRoutes from './routes/itemRoutes';
import userRoutes from './routes/user';
import webhookRoutes from './routes/webhooks';
import paypalRoutes from './routes/paypalRoutes';
const multer = require("multer");
const app = express();


app.use(express.urlencoded({ extended: true })); // body will not work
app.use(express.json());


// Routes
app.use('/items', itemRoutes);
app.use('/users', userRoutes);
app.use('/', webhookRoutes);
app.use('/paypal',paypalRoutes)

export default app;