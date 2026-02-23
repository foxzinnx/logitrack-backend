import type { FastifyInstance } from "fastify";
import type { AdminController, AuthenticateAdminBody, CreateAdminBody } from "../controllers/AdminController.js";

export async function adminRoutes(
    fastify: FastifyInstance,
    adminController: AdminController
){
    fastify.post<{ Body: CreateAdminBody }>('/admins', adminController.create.bind(adminController));
    fastify.post<{ Body: AuthenticateAdminBody }>('/admins/login', adminController.authenticate.bind(adminController));
}