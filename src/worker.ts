import { redisSingletonInstance } from "./redis";

const redis = redisSingletonInstance;
declare var onmessage: (event: MessageEvent) => void;

console.log("Worker is now active ");

(async function startRedisConsumer() {
    console.log("Called function");

    while (true) {
        try {
            const value = await redis.brpop("hashValue", 0);
            if (value) {
                const [key, message] = value;
                console.log("Just popped:", message);
            } else {
                console.log("No message yet");
            }
        } catch (err) {
            console.error("Redis error:", err);
            await Bun.sleep(1000);
        }
    }
})();
