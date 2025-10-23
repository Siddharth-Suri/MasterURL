import type { RedisClient } from "bun";
import { computeHash } from "./hash";
import { redisSingletonInstance } from "./redis";
export default {
    port: 3000,
    async fetch(req: Request) {
        const hashes: string[] = computeHash();

        if (!redisSingletonInstance) {
            console.log("Redis is down at the moment");
            return new Response("Redis is down");
        }

        const redis = redisSingletonInstance;

        const url = new URL(req.url);
        const { pathname } = url;
        switch (pathname) {
            case "/create":
                const value = hashes.pop() as string;
                await redis.lpush("hashValue:", value);
                return;
            case "/delete":

            case "/create":

            case "/search/xyszyyd":
        }
    },
};
