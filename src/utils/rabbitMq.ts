
const Env = require('dotenv')
// Load environment variables from .env file
Env.config();
const amqp = require("amqplib");

// Connect to RabbitMQ
let order, channel, connection;

export async function connectToRabbitMQ() {

    const amqpServer = process.env.RABBITMQ || "";
    const deliveryQueue = "delivery-queue";

    const rabbitmqConfig = {
        url: amqpServer, // Replace with your AmazonMQ connection string
        queue: deliveryQueue // Name of the queue for order updates
      };

    try {
        let connection = await amqp.connect(rabbitmqConfig.url);
        let channel = await connection.createChannel();
        let assert =   await channel.assertQueue(rabbitmqConfig.queue, { durable: true }); // Ensure queue exists
        console.error('Connecting to RabbitMQ......',assert);
        let test = 'test-100'
        return { connection, channel, test};
      } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        process.exit(1); // Exit on connection error
      }







      


























      
}