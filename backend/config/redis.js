import redis from "redis";

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (err) => {
    console.log("Redis error", err);
});

redisClient.on("connect", () => {
    console.log("Redis connected");
});

redisClient.connect().catch(console.error);

export default redisClient;
