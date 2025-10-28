import { redisSingletonInstance } from "./redis";
import { PrismaConnection } from "./singleton";

// can create a rollback here , in case a value addition gives error you can perform a rollback

enum errorDetector {
    NoError,
    RedisError,
    prismaError,
}

export async function deleteOperation({
    originalURL,
    hash,
}: {
    originalURL: string;
    hash: string;
}) {
    const redis = redisSingletonInstance;
    const prisma = PrismaConnection();
    let e: errorDetector = errorDetector.NoError;
    try {
        const redisValue = await redis.srem(`cache:${originalURL}`, hash);
        if (!redisValue) e = errorDetector.RedisError;
        const prismaValue = await prisma.hash.deleteMany({
            where: {
                value: hash,
            },
        });
        if (prismaValue.count === 0) e = errorDetector.prismaError;
    } catch {
        if (e === errorDetector.prismaError) {
            return JSON.stringify({ msg: "Prisma Failed" });
        } else {
            return JSON.stringify({ msg: "Redis Failed" });
        }
    }
}
