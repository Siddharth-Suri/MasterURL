import { redisSingletonInstance } from "./redis";
import { PrismaConnection as Prisma } from "./singleton";

console.log("Worker is now active ");
export const redis = redisSingletonInstance;

(async function startRedisConsumer() {
    console.log("Called function");

    while (true) {
        try {
            const data = await redis.brpop("hashValue", 0);
            if (data) {
                const [key, message] = data;
                console.log(message);
                const { value, originalURL } = JSON.parse(message);
                try {
                    const alreadyExists = await Prisma.eachURL.findUnique({
                        where: {
                            originalURL,
                        },
                    });
                    if (!alreadyExists) {
                        Prisma.eachURL.create({
                            data: {
                                originalURL,
                                hashes: {
                                    create: { value },
                                },
                            },
                        });
                    } else {
                        Prisma.hash.create({
                            data: {
                                value: value,
                                origin: originalURL,
                                eachURL: {
                                    connect: { originalURL },
                                },
                            },
                        });
                    }
                } catch (e) {
                    console.log("Prisma is down");
                }
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
