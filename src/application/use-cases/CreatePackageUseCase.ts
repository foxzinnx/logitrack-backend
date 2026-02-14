import type { IPackageRepository } from "@/domain/repositories/IPackageRepository.js";
import type { CreatePackageDTO } from "../dtos/CreatePackageDTO.js";
import type { PackageResponseDTO } from "../dtos/PackageResponseDTO.js";
import { Address } from "@/domain/value-objects/Address.js";
import { Package } from "@/domain/entities/Package.js";

export class CreatePackageUseCase{
    constructor(private packageRepository: IPackageRepository ){}

    async execute(input: CreatePackageDTO): Promise<PackageResponseDTO> {
        const address = Address.create(
            input.street,
            input.number,
            input.neighborhood,
            input.city,
            input.state,
            input.zipCode,
            input.complement
        );

        const pkg = Package.create(
            input.recipientName,
            input.recipientPhone,
            address
        );

        await this.packageRepository.create(pkg);

        return this.toDTO(pkg);
    }

    private toDTO(pkg: Package): PackageResponseDTO{
        return {
            id: pkg.getId().getValue(),
            recipientName: pkg.getRecipientName(),
            recipientPhone: pkg.getRecipientPhone(),
            address: {
                street: pkg.getDeliveryAddress().getStreet(),
                number: pkg.getDeliveryAddress().getNumber(),
                complement: pkg.getDeliveryAddress().getComplement(),
                neighborhood: pkg.getDeliveryAddress().getNeighborhood(),
                city: pkg.getDeliveryAddress().getCity(),
                state: pkg.getDeliveryAddress().getState(),
                zipCode: pkg.getDeliveryAddress().getZipCode()
            },
            status: pkg.getStatus(),
            delivererId: pkg.getDelivererId()?.getValue() || null,
            deliveryPhotoUrl: pkg.getDeliveryPhotoUrl(),
            deliveredAt: pkg.getDeliveredAt(),
            createdAt: pkg.getCreatedAt(),
            updatedAt: pkg.getUpdatedAt()
        }
    }
}