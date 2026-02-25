import type { FastifyInstance } from "fastify";
import { PackageController, type AssignPackageBody, type CreatePackageBody, type MarkAsDeliveredBody, type PackageIdParams } from "../controllers/PackageController.js";
import { adminOnly, authMiddleware, delivererOnly } from "@/presentation/middlewares/AuthMiddleware.js";

export async function packageRoutes(
    fastify: FastifyInstance,
    packageController: PackageController
){
    fastify.post<{ Body: CreatePackageBody }>(
        '/packages',
        { preHandler: [adminOnly] },
        packageController.create.bind(packageController)
    );

    fastify.patch<{ Params: PackageIdParams, Body: AssignPackageBody }>(
        '/packages/:id/assign',
        { preHandler: [adminOnly] },
        packageController.assignToDeliverer.bind(packageController)
    );

    fastify.patch<{ Params: PackageIdParams, Body: MarkAsDeliveredBody}>(
        '/packages/:id/deliver',
        { preHandler: [delivererOnly] },
        packageController.markAsDelivered.bind(packageController)
    );

    fastify.get(
        '/packages/me',
        { preHandler: [delivererOnly] },
        packageController.listMyPackages.bind(packageController)
    );

    fastify.get<{ Params: { delivererId: string } }>(
        '/packages/deliverer/:delivererId',
        { preHandler: [authMiddleware] },
        packageController.listByDeliverer.bind(packageController)
    );

    fastify.get<{ Params: PackageIdParams }>(
        '/packages/:id',
        { preHandler: [authMiddleware] },
        packageController.getDetails.bind(packageController)
    );
}