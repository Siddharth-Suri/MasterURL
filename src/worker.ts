import { redisSingletonInstance } from "./redis";
import { PrismaConnection } from "./singleton";

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
                const { hash, originalURL } = JSON.parse(message);
                try {
                    const Prisma = PrismaConnection();
                    const data = await Prisma.eachUrl.upsert({
                        where: {
                            originalURL,
                        },
                        update: {
                            hash: {
                                connectOrCreate: {
                                    where: { value: hash },
                                    create: {
                                        origin: originalURL,
                                        value: hash,
                                    },
                                },
                            },
                        },
                        create: {
                            originalURL,
                            hash: {
                                create: {
                                    origin: originalURL,
                                    value: hash,
                                },
                            },
                        },
                        include: { hash: true },
                    });
                    console.log(data);
                } catch (e) {
                    console.log("Database is down " + e);
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
