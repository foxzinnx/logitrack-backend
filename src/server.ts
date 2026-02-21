import { PrismaClient } from "@/generated/prisma/client.js";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import 'dotenv/config';
import cors from 'fastify';
import Fastify from "fastify";
import { ErrorHandler } from "./presentation/middlewares/ErrorHandler.js";
import { makeControllers } from "./presentation/factories/makeControllers.js";
import { packageRoutes } from "./presentation/http/routes/packageRoutes.js";
import { delivererRoutes } from "./presentation/http/routes/delivererRoutes.js";
import { adminRoutes } from "./presentation/http/routes/adminRoutes.js";

const prisma = new PrismaClient()

const fastify = Fastify({
    logger: true
})

fastify.register(cors, {
    origin: true
});

fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string
});

fastify.register(multipart);

fastify.setErrorHandler(ErrorHandler);

fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

const { packageController, delivererController ,adminController } = makeControllers(prisma);

fastify.register(async (instance) => {
    await packageRoutes(instance, packageController);
    await delivererRoutes(instance, delivererController);
    await adminRoutes(instance, adminController);
});

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3333;
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Server is running on http://localhost:${port}`);
    } catch (error) {
        fastify.log.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

start();