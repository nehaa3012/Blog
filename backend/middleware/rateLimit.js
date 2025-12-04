import RateLimit from "express-rate-limit";
import { RedisStore } from 'rate-limit-redis'
import redisClient from "../config/redis.js";


// auth specfic rate limit 5 attempts per 15 mins per IP
export const authLimiter = RateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: 'rl:',
    }),
    max: 5,
    windowMs: 15 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again laterrrr.'
});