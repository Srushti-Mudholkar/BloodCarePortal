import { createClient } from "redis";

let redisClient = null;

if (process.env.REDIS_URL) {
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", () => {}); // silence repeated error logs
    client.on("connect", () => console.log("Connected to Redis"));

    await client.connect();
    redisClient = client;
  } catch (e) {
    console.log("Redis not available — app will run without caching");
    redisClient = null;
  }
} else {
  console.log("No REDIS_URL set — caching disabled");
}

export default redisClient;