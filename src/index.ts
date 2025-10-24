import { computeHash } from "./hash";
import { redisSingletonInstance } from "./redis";

console.log("worker");

const worker = new Worker(new URL("./worker.ts", import.meta.url).href, {
    type: "module",
});

worker.onmessage = (event) => {
    console.log(event.data);
};
console.log("worker complete");

export default {
    port: 3000,
    async fetch(req: Request) {
        const hashes: string[] = computeHash();
        console.log("here");

        if (!redisSingletonInstance) {
            console.log("Redis is down at the moment");
            return new Response("Redis is down");
        }

        const redis = redisSingletonInstance;

        const url = new URL(req.url);
        const { pathname } = url;
        switch (pathname) {
            case "/":
                console.log("reached endpoint");
                const value = hashes.pop() as string;
                redis.lpush("hashValue", value);
                return new Response("Reached");

            case "/delete":
                return new Response("Reached");

            case "/list":
                return new Response("Reached");

            case "/search/":
                return new Response("Reached");
            default:
                return new Response("Not found", { status: 404 });
        }
        return;
    },
};
