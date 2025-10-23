import { redis, RedisClient } from "bun";
const URL: string = "redis://localhost:6379";

class RedisInstance {
    private static instance: RedisInstance;
    private connection: Bun.RedisClient;

    private constructor() {
        this.connection = new RedisClient(URL);
    }

    public static createInstance() {
        if (!RedisInstance.instance) {
            RedisInstance.instance = new RedisInstance();
        } else return RedisInstance.instance;
    }

    public getConnection() {
        return this.connection;
    }
}

export const redisSingletonInstance =
    RedisInstance.createInstance()?.getConnection();
