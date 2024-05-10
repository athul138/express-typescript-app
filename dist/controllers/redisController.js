"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCache = void 0;
// Node.js code for caching with Redis
// const redis = require('redis');
const Redis = require('ioredis');
// const client = redis.createClient({ host: "as", port: "kihkjl", password: "jbjkhjk,b" });
const checkCache = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.checkCache = checkCache;
