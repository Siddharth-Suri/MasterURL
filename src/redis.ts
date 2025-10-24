import { RedisClient } from "bun";
const URL: string = "redis://localhost:6379";

class RedisInstance {
    private static instance: RedisInstance;
    private connection: Bun.RedisClient;

    private constructor() {
        this.connection = new RedisClient(URL);
        console.log("Constructor called: " + this.connection);
    }

    public static createInstance() {
        if (!RedisInstance.instance) {
            RedisInstance.instance = new RedisInstance();
        }
        return RedisInstance.instance;
    }

    public async getConnection() {
        await this.connection.connect();
        return this.connection;
    }
}

export const redisSingletonInstance =
    await RedisInstance.createInstance().getConnection();
