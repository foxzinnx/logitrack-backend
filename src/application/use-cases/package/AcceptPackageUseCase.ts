import type { AcceptPackageDTO } from "@/application/dtos/AcceptPackageDTO.js";
import type { PackageResponseDTO } from "@/application/dtos/PackageResponseDTO.js";
import { DelivererNotFoundError } from "@/domain/errors/DelivererErrors.js";
import { PackageAlreadyAssignedError, PackageNotFoundError } from "@/domain/errors/PackageErrors.js";
import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";
import type { IPackageRepository } from "@/domain/repositories/IPackageRepository.js";
import { UUID } from "@/domain/value-objects/UUID.js";

export class AcceptPackageUseCase{
    constructor(
        private packageRepository: IPackageRepository,
        private delivererRepository: IDelivererRepository
    ){}

    async execute(input: AcceptPackageDTO): Promise<PackageResponseDTO> {
        const packageId = UUID.create(input.packageId);
        const delivererId = UUID.create(input.delivererId);

        const pkg = await this.packageRepository.findById(packageId);
        if(!pkg){
            throw new PackageNotFoundError();
        }

        if(pkg.getDelivererId() !== null){
            throw new PackageAlreadyAssignedError();
        }

        const deliverer = await this.delivererRepository.findById(delivererId);
        if(!deliverer){
            throw new DelivererNotFoundError();
        }

        pkg.assignToDeliverer(delivererId);
        await this.delivererRepository.update(deliverer);

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