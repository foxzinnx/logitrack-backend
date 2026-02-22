import type { PrismaClient } from "@/generated/prisma/client.js";
import { Package, PackageStatus } from "@/domain/entities/Package.js";
import type { IPackageRepository } from "@/domain/repositories/IPackageRepository.js";
import { UUID } from "@/domain/value-objects/UUID.js";
import { Address } from "@/domain/value-objects/Address.js";

export class PrismaPackageRepository implements IPackageRepository {
    constructor(private prisma: PrismaClient){}
    
    async create(pkg: Package): Promise<void> {
        await this.prisma.package.create({
            data: {
                id: pkg.getId().getValue(),
                recipientName: pkg.getRecipientName(),
                recipientPhone: pkg.getRecipientPhone(),
                street: pkg.getDeliveryAddress().getStreet(),
                number: pkg.getDeliveryAddress().getNumber(),
                complement: pkg.getDeliveryAddress().getComplement(),
                neighborhood: pkg.getDeliveryAddress().getNeighborhood(),
                city: pkg.getDeliveryAddress().getCity(),
                state: pkg.getDeliveryAddress().getState(),
                zipCode: pkg.getDeliveryAddress().getZipCode(),
                status: pkg.getStatus(),
                delivererId: pkg.getDelivererId()?.getValue() || null,
                deliveryPhotoUrl: pkg.getDeliveryPhotoUrl(),
                deliveredAt: pkg.getDeliveredAt(),
                createdAt: pkg.getCreatedAt(),
                updatedAt: pkg.getUpdatedAt()
            }
        })
    }
    async findById(id: UUID): Promise<Package | null> {
        const data = await this.prisma.package.findUnique({
            where: { id: id.getValue() }
        })

        if(!data) return null;

        return this.toDomain(data);
    }

    async findByDelivererId(delivererId: UUID): Promise<Package[]> {
        const packages = await this.prisma.package.findMany({
            where: { delivererId: delivererId.getValue() }
        });

        return packages.map(pkg => this.toDomain(pkg));
    }

    async findAll(): Promise<Package[]> {
        const packages = await this.prisma.package.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return packages.map(pkg => this.toDomain(pkg));
    }

    async findPending(): Promise<Package[]> {
        const packages = await this.prisma.package.findMany({
            where: {
                status: {
                    in: [PackageStatus.PENDING, PackageStatus.AWAITING_PICKUP]
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return packages.map(pkg => this.toDomain(pkg));
    }

    async update(pkg: Package): Promise<void> {
        await this.prisma.package.update({
            where: { id: pkg.getId().getValue() },
            data: {
                recipientName: pkg.getRecipientName(),
                recipientPhone: pkg.getRecipientPhone(),
                status: pkg.getStatus(),
                delivererId: pkg.getDelivererId()?.getValue() || null,
                deliveryPhotoUrl: pkg.getDeliveryPhotoUrl(),
                deliveredAt: pkg.getDeliveredAt(),
                updatedAt: pkg.getUpdatedAt()
            }
        })
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.package.delete({
            where: { id: id.getValue() }
        })
    }

    private toDomain(data: any): Package {
        const address = Address.create(
            data.street,
            data.number,
            data.neighborhood,
            data.city,
            data.state,
            data.zipCode,
            data.complement
        );

        return Package.restore(
            UUID.create(data.id),
            data.recipientName,
            data.recipientPhone,
            address,
            data.status as PackageStatus,
            data.delivererId ? UUID.create(data.delivererId) : null,
            data.deliveryPhotoUrl,
            data.deliveredAt,
            data.createdAt,
            data.updatedAt
        );
    }

}