import type { FastifyInstance } from "fastify";
import type { CreateDelivererBody, DelivererController } from "../controllers/DelivererController.js";
import { adminOnly } from "@/presentation/middlewares/AuthMiddleware.js";

export async function delivererRoutes(
    fastify: FastifyInstance, 
    delivererController: DelivererController
) {
    fastify.post<{ Body: CreateDelivererBody }>(
        '/deliverers',
        { preHandler: [adminOnly] },
        delivererController.create.bind(delivererController)
    );

    fastify.get(
        '/deliverers/active',
        { preHandler: [adminOnly] },
        delivererController.listActive.bind(delivererController)
    );
}