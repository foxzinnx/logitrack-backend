import type { CreateDelivererUseCase } from "@/application/use-cases/deliverer/CreateDelivererUseCase.js";
import type { ListActiveDeliveresUseCase } from "@/application/use-cases/deliverer/ListActiveDeliveresUseCase.js";
import type { FastifyReply, FastifyRequest } from "fastify";

interface CreateDelivererBody{
    name: string;
    cpf: string;
    phone: string;
}

export class DelivererController {
    constructor(
        private createDelivererUseCase: CreateDelivererUseCase,
        private listActiveDeliverersUseCase: ListActiveDeliveresUseCase
    ){}

    async create(request: FastifyRequest<{ Body: CreateDelivererBody }>, reply: FastifyReply){
        const result = await this.createDelivererUseCase.execute(request.body);
        return reply.status(201).send(result);
    }

    async listActive(request: FastifyRequest, reply: FastifyReply){
        const result = await this.listActiveDeliverersUseCase.execute();
        return reply.status(200).send(result);
    }
}