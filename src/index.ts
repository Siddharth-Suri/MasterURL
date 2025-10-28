import { computeHash } from "./hash";
import { redisSingletonInstance } from "./redis";

const addWorker = new Worker(new URL("./add-worker.ts", import.meta.url), {
    type: "module",
});

export default {
    port: 3000,
    async fetch(req: Request) {
        const hashes = computeHash();
        console.log(req.method);
        let body: any;
        if (req.method != "GET") {
            body = await req.json();
        }

        if (!redisSingletonInstance) {
            console.log("Redis is down at the moment");
            return new Response(JSON.stringify({ error: "Redis is down" }), {
                status: 503,
                headers: { "Content-Type": "application/json" },
            });
        }

        const redis = redisSingletonInstance;

        const url = new URL(req.url);
        const { pathname } = url;
        switch (pathname) {
            case "/api/shorten":
                const { originalURL } = body;

                if (!body)
                    return new Response(
                        JSON.stringify({ error: "No URL was sent" }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" },
                        }
                    );

                console.log("Reached endpoint");
                const value = hashes.pop() as string;

                redis.lpush(
                    "hashValue",
                    JSON.stringify({ hash: value, originalURL })
                );

                return new Response(
                    JSON.stringify({
                        msg: "Shortened your url",
                        hash: { value },
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    }
                );

            case "api/delete":
                const { hash } = body;

                return new Response("Reached");

            case "api/list":
                return new Response("Reached");

            case "api/search/":
                return new Response("Reached");
            default:
                return new Response(
                    JSON.stringify({
                        err: "No endpoint exists ",
                    }),
                    {
                        headers: { "Content-Type": "application/json" },
                        status: 404,
                    }
                );
        }
    },
};
