import type { AuthenticateDelivererUseCase } from "@/application/use-cases/deliverer/AuthenticateDelivererUseCase.js";
import type { CreateDelivererUseCase } from "@/application/use-cases/deliverer/CreateDelivererUseCase.js";
import type { ListActiveDeliveresUseCase } from "@/application/use-cases/deliverer/ListActiveDeliveresUseCase.js";
import type { UpdateDelivererStatusUseCase } from "@/application/use-cases/deliverer/UpdateDelivererStatusUseCase.js";
import type { DelivererStatus } from "@/domain/entities/Deliverer.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export interface CreateDelivererBody {
    name: string;
    cpf: string;
    phone: string;
    password: string;
}

export interface AuthDelivererBody {
    cpf: string;
    password: string;
}

export interface UpdateStatusParams {
    id: string;
}

export interface UpdateStatusBody {
    status: DelivererStatus;
}

export class DelivererController {
    constructor(
        private createDelivererUseCase: CreateDelivererUseCase,
        private listActiveDeliverersUseCase: ListActiveDeliveresUseCase,
        private authenticateDelivererUseCase: AuthenticateDelivererUseCase,
        private updateDelivererStatusUseCase: UpdateDelivererStatusUseCase
    ){}

    async create(request: FastifyRequest<{ Body: CreateDelivererBody }>, reply: FastifyReply){
        const result = await this.createDelivererUseCase.execute(request.body);
        return reply.status(201).send(result);
    }

    async listActive(request: FastifyRequest, reply: FastifyReply){
        const result = await this.listActiveDeliverersUseCase.execute();
        return reply.status(200).send(result);
    }

    async authenticate(request: FastifyRequest<{ Body: AuthDelivererBody }>, reply: FastifyReply){
        const result = await this.authenticateDelivererUseCase.execute(request.body);
        return reply.status(200).send(result);
    }

    async updateStatus(request: FastifyRequest<{ Params: UpdateStatusParams, Body: UpdateStatusBody }>, reply: FastifyReply){
        const { id } = request.params;
        const { status } = request.body;
        
        await this.updateDelivererStatusUseCase.execute({
            delivererId: id,
            status
        });

        return reply.status(204).send();
    }
}