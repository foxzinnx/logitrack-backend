import { Deliverer, DelivererStatus } from "@/domain/entities/Deliverer.js";
import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";
import { CPF } from "@/domain/value-objects/CPF.js";
import { UUID } from "@/domain/value-objects/UUID.js";
import type { PrismaClient } from "@/generated/prisma/client.js";

export class PrismaDelivererRepository implements IDelivererRepository {
    constructor(private prisma: PrismaClient){}
    
    async create(deliverer: Deliverer): Promise<void> {
        await this.prisma.deliverer.create({
            data: {
                id: deliverer.getId().getValue(),
                name: deliverer.getName(),
                cpf: deliverer.getCPF().getValue(),
                phone: deliverer.getPhone(),
                passwordHash: deliverer.getPasswordHash(),
                status: deliverer.getStatus(),
                isActive: deliverer.getIsActive(),
                createdAt: deliverer.getCreatedAt(),
                updatedAt: deliverer.getUpdatedAt()
            }
        })
    }

    async findById(id: UUID): Promise<Deliverer | null> {
        const data = await this.prisma.deliverer.findUnique({
            where: { id: id.getValue() }
        });

        if(!data) return null;

        return this.toDomain(data);
    }

    async findByCPF(cpf: CPF): Promise<Deliverer | null> {
        const data = await this.prisma.deliverer.findUnique({
            where: { cpf: cpf.getValue() }
        });

        if(!data) return null;

        return this.toDomain(data);
    }

    async findAll(): Promise<Deliverer[]> {
        const deliveres = await this.prisma.deliverer.findMany({
            orderBy: { name: 'asc' }
        });

        return deliveres.map(d => this.toDomain(d));
    }

    async findAllActive(): Promise<Deliverer[]> {
        const deliveres = await this.prisma.deliverer.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });

        return deliveres.map(d => this.toDomain(d));
    }

    async update(deliverer: Deliverer): Promise<void> {
        await this.prisma.deliverer.update({
            where: { id: deliverer.getId().getValue() },
            data: {
                name: deliverer.getName(),
                phone: deliverer.getPhone(),
                isActive: deliverer.getIsActive(),
                updatedAt: deliverer.getUpdatedAt()
            }
        });
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.deliverer.delete({
            where: { id: id.getValue() }
        })
    }

    private toDomain(data: any): Deliverer {
        return Deliverer.restore(
            UUID.create(data.id),
            data.name,
            CPF.create(data.cpf),
            data.phone,
            data.passwordHash,
            data.status as DelivererStatus,
            data.isActive,
            data.createdAt,
            data.updatedAt
        )
    }

}