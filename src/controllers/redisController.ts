// Node.js code for caching with Redis
// const redis = require('redis');
const Redis = require('ioredis');
// const client = redis.createClient({ host: "as", port: "kihkjl", password: "jbjkhjk,b" });

export const checkCache = async (req: any, res: any, next: any) => {
    // try {

    //     console.log("inside redis ------------------------>>>>")

    //     const redis = new Redis({
    //         // Use the appropriate URL based on your needs
    //         // (internal or external, with authentication if applicable)
    //         // url: 'rediss://red-coefli8l6cac73c3bitg:xUASZxFaADY1twvFgyQBewbc115axSSj@singapore-redis.render.com:6379', // Replace with your actual URL
    //         url: 'redis://red-coefli8l6cac73c3bitg:6379', // Replace with your actual URL
    //         password: 'xUASZxFaADY1twvFgyQBewbc115axSSj' // Add password if required
    //     });

    //     // Test the connection (optional)
    //     redis.on('connect', () => {
    //         console.log('Connected to Redis')
    //     });
    //     redis.on('error', (err:any) => console.error('Redis Connection Error:', err));

    //     res.json(redis);
    // } catch (error) {
    //     res.status(500).send('Server Error');
    // }
};


