import type { PackageResponseDTO } from "@/application/dtos/PackageResponseDTO.js";
import type { Package } from "@/domain/entities/Package.js";
import { PackageNotFoundError } from "@/domain/errors/PackageErrors.js";
import type { IPackageRepository } from "@/domain/repositories/IPackageRepository.js";
import { UUID } from "@/domain/value-objects/UUID.js";

interface MarkAsDeliveredDTO {
    packageId: string;
    photoUrl: string;
}

export class MarkPackageAsDeliveredUseCase {
    constructor(
        private packageRepository: IPackageRepository
    ){}

    async execute(input: MarkAsDeliveredDTO): Promise<PackageResponseDTO>{
        const packageId = UUID.create(input.packageId);

        const pkg = await this.packageRepository.findById(packageId);
        if(!pkg){
            throw new PackageNotFoundError();
        }

        pkg.markAsDelivered(input.photoUrl);

        await this.packageRepository.update(pkg);

        return this.toDTO(pkg);
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