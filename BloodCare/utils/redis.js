import {createClient} from "redis";

const redisClient = createClient({
    url : process.env.REDIS_URL ||  "redis://localhost:6379",
});

redisClient.on("error",(e) => console.log("Redis error",err));
redisClient.on("connect",() => console.log("connected to Redis"))

await redisClient.connect();

export default redisClient;