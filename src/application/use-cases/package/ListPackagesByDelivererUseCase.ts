import type { PackageResponseDTO } from "@/application/dtos/PackageResponseDTO.js";
import type { Package } from "@/domain/entities/Package.js";
import type { IPackageRepository } from "@/domain/repositories/IPackageRepository.js";
import { UUID } from "@/domain/value-objects/UUID.js";

export class ListPackagesByDelivererUseCase {
    constructor(
        private packageRepository: IPackageRepository
    ){}

    async execute(delivererId: string): Promise<PackageResponseDTO[]> {
        const id = UUID.create(delivererId);

        const packages = await this.packageRepository.findByDelivererId(id);

        return packages.map(pkg => this.toDTO(pkg));
    }

    private toDTO(pkg: Package): PackageResponseDTO {
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
        };
    }
}