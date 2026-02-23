import type { FastifyInstance } from "fastify";
import type { AuthDelivererBody, CreateDelivererBody, DelivererController, UpdateStatusBody, UpdateStatusParams } from "../controllers/DelivererController.js";
import { adminOnly, delivererOnly } from "@/presentation/middlewares/AuthMiddleware.js";

export async function delivererRoutes(
    fastify: FastifyInstance, 
    delivererController: DelivererController
) {

    fastify.post<{ Body: AuthDelivererBody }>(
        '/deliverers/login',
        delivererController.authenticate.bind(delivererController)
    )

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

    fastify.patch<{ Params: UpdateStatusParams, Body: UpdateStatusBody }>(
        '/deliverers/:id/status',
        { preHandler: [delivererOnly] },
        delivererController.updateStatus.bind(delivererController)
    )
}