import { Admin } from "@/domain/entities/Admin.js";
import type { IAdminRepository } from "@/domain/repositories/IAdminRepository.js";
import { Email } from "@/domain/value-objects/Email.js";
import { UUID } from "@/domain/value-objects/UUID.js";
import type { PrismaClient } from "@/generated/prisma/client.js";

export class PrismaAdminRepository implements IAdminRepository {
    constructor(private prisma: PrismaClient){}
    
    async create(admin: Admin): Promise<void> {
        await this.prisma.admin.create({
            data: {
                id: admin.getId().getValue(),
                name: admin.getName(),
                email: admin.getEmail().getValue(),
                passwordHash: admin.getPasswordHash(),
                isActive: admin.getIsActive(),
                createdAt: admin.getCreatedAt(),
                updatedAt: admin.getUpdatedAt()
            }
        })
    }

    async findById(id: UUID): Promise<Admin | null> {
        const data = await this.prisma.admin.findUnique({
            where: { id: id.getValue() }
        });
        
        if(!data) return null;

        return this.toDomain(data);
    }

    async findByEmail(email: Email): Promise<Admin | null> {
        const data = await this.prisma.admin.findUnique({
            where: { email: email.getValue() }
        });

        if(!data) return null;

        return this.toDomain(data);
    }

    async findAll(): Promise<Admin[]> {
        const admins = await this.prisma.admin.findMany({
            orderBy: { createdAt: 'asc' }
        });

        return admins.map(a => this.toDomain(a));
    }

    async update(admin: Admin): Promise<void> {
        await this.prisma.admin.update({
            where: { id: admin.getId().getValue() },
            data: {
                name: admin.getName(),
                passwordHash: admin.getPasswordHash(),
                isActive: admin.getIsActive(),
                updatedAt: admin.getUpdatedAt()
            }
        })
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.admin.delete({
            where: { id: id.getValue() }
        })
    }

    private toDomain(data: any): Admin {
        return Admin.restore(
            UUID.create(data.id),
            data.name,
            Email.create(data.email),
            data.passwordHash,
            data.isActive,
            data.createdAt,
            data.updatedAt
        );
    }
}