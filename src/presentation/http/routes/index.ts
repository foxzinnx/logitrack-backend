import type { FastifyInstance } from "fastify";
import type { PackageController } from "../controllers/PackageController.js";
import type { DelivererController } from "../controllers/DelivererController.js";
import type { AdminController } from "../controllers/AdminController.js";
import { packageRoutes } from "./packageRoutes.js";
import { delivererRoutes } from "./delivererRoutes.js";
import { adminRoutes } from "./adminRoutes.js";

interface Controllers {
    packageController: PackageController;
    delivererController: DelivererController;
    adminController: AdminController;
}

export async function setupRoutes(
    fastify: FastifyInstance,
    controllers: Controllers
){
    fastify.register(async (instance) => {
        await packageRoutes(instance, controllers.packageController);
        await delivererRoutes(instance, controllers.delivererController);
        await adminRoutes(instance, controllers.adminController);
    }, { prefix: '/api/v1' });
}