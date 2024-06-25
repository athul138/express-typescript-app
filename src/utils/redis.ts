// const redis = require('redis');
import { createClient } from 'redis';

export async function connectRedis() {

    const client = createClient({
        url: process.env.REDIS_URL,
        username: process.env.REDIS_USERNAME ,
        password: process.env.REDIS_PASSWORD
    });

    try {

        client.on('error', err => console.log('Redis Client Error', err));
        let redisConnection = await client.connect();
        return redisConnection

    } catch (error) {

        console.error('Error connecting to Redis:', error);
        await client.disconnect();

    } 

}