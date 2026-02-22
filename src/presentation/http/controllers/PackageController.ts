import type { AssignPackageToDelivererUseCase } from "@/application/use-cases/package/AssignPackageToDelivererUseCase.js";
import type { CreatePackageUseCase } from "@/application/use-cases/package/CreatePackageUseCase.js";
import type { GetPackageDetailsUseCase } from "@/application/use-cases/package/GetPackageDetailsUseCase.js";
import type { ListPackagesByDelivererUseCase } from "@/application/use-cases/package/ListPackagesByDelivererUseCase.js";
import type { MarkPackageAsDeliveredUseCase } from "@/application/use-cases/package/MarkPackageAsDeliveredUseCase.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export interface CreatePackageBody{
    recipientName: string;
    recipientPhone: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface AssignPackageBody{
    delivererId: string;
}

export interface MarkAsDeliveredBody {
    photoUrl: string;
}

export class PackageController{
    constructor(
        private createPackageUseCase: CreatePackageUseCase,
        private assignPackageToDelivererUseCase: AssignPackageToDelivererUseCase,
        private markPackageAsDeliveredUseCase: MarkPackageAsDeliveredUseCase,
        private listPackagesByDelivererUseCase: ListPackagesByDelivererUseCase,
        private getPackageDetailsUseCase: GetPackageDetailsUseCase
    ){}

    async create(request: FastifyRequest<{ Body: CreatePackageBody }>, reply: FastifyReply){
        const result = await this.createPackageUseCase.execute(request.body);
        return reply.status(201).send(result);
    }

    async assignToDeliverer(request: FastifyRequest<{ Params: { id: string }, Body: AssignPackageBody }>, reply: FastifyReply){
        const result = await this.assignPackageToDelivererUseCase.execute({
            packageId: request.params.id,
            delivererId: request.body.delivererId
        });

        return reply.status(200).send(result);
    }

    async markAsDelivered(request: FastifyRequest<{ Params: { id: string }, Body: MarkAsDeliveredBody}>, reply: FastifyReply){
        const result = await this.markPackageAsDeliveredUseCase.execute({
            packageId: request.params.id,
            photoUrl: request.body.photoUrl
        });

        return reply.status(200).send(result);
    }

    async listByDeliverer(request: FastifyRequest<{ Params: { delivererId: string } }>, reply: FastifyReply){
        const result = await this.listPackagesByDelivererUseCase.execute(request.params.delivererId);
        return reply.status(200).send(result);
    }

    async getDetails(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply){
        const result = await this.getPackageDetailsUseCase.execute(request.params.id);
        return reply.status(200).send(result);
    }
}