import { PrismaClient } from "./generated/prisma/client";

class PrismaSingleton {
    private static connection: PrismaClient; // wtf PrismaClient has been returned as any so i will do the same would be an object imo
    private static instance: PrismaSingleton;

    private constructor() {
        if (!PrismaSingleton.connection) {
            PrismaSingleton.connection = new PrismaClient();
        }
    }

    public static getInstance(): PrismaSingleton {
        if (!this.instance) {
            return (this.instance = new PrismaSingleton());
        }
        return this.instance;
    }

    public getConnection(): PrismaClient {
        return PrismaSingleton.connection;
    }
}

export const PrismaConnection = () => {
    const Connection: PrismaClient =
        PrismaSingleton.getInstance().getConnection();
    return Connection;
};
