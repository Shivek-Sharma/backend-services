import { createClient } from "redis";

const REDIS_HOST = "localhost";
const REDIS_PORT = 6379;

const client = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// Connect to Redis
async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

// Get value from Redis
async function getLastSentNewsId() {
  await connectRedis();
  const lastSentNewsId = await client.get("lastSentNewsId");
  return lastSentNewsId ? parseInt(lastSentNewsId, 10) : null; // Ensure we return an integer or null
}

// Set value in Redis
async function setLastSentNewsId(id) {
  await connectRedis();
  await client.set("lastSentNewsId", id.toString());
}

export { getLastSentNewsId, setLastSentNewsId };
