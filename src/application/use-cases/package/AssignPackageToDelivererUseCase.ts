import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";
import type { IPackageRepository } from "@/domain/repositories/IPackageRepository.js";
import type { PackageResponseDTO } from "../../dtos/PackageResponseDTO.js";
import { UUID } from "@/domain/value-objects/UUID.js";
import type { Package } from "@/domain/entities/Package.js";
import { PackageNotFoundError } from "@/domain/errors/PackageErrors.js";
import { DelivererNotActiveError, DelivererNotFoundError } from "@/domain/errors/DelivererErrors.js";

interface AssignPackageDTO {
    packageId: string;
    delivererId: string;
}

export class AssignPackageToDelivererUseCase{
    constructor(
        private packageRepository: IPackageRepository,
        private delivererRepository: IDelivererRepository
    ){}

    async execute(input: AssignPackageDTO): Promise<PackageResponseDTO> {
        const packageId = UUID.create(input.packageId);
        const delivererId = UUID.create(input.delivererId);

        const pkg = await this.packageRepository.findById(packageId);
        if(!pkg){
            throw new PackageNotFoundError()
        }

        const deliverer = await this.delivererRepository.findById(delivererId);
        if(!deliverer){
            throw new DelivererNotFoundError()
        }

        if(!deliverer.getIsActive()){
            throw new DelivererNotActiveError()
        }

        pkg.assignToDeliverer(delivererId);

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