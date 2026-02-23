import type { UpdateStatusDTO } from "@/application/dtos/UpdateStatusDTO.js";
import { DelivererNotFoundError } from "@/domain/errors/DelivererErrors.js";
import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";
import { UUID } from "@/domain/value-objects/UUID.js";

export class UpdateDelivererStatusUseCase{
    constructor(
        private delivererRepository: IDelivererRepository
    ){}

    async execute(input: UpdateStatusDTO): Promise<void> {
        const delivererId = UUID.create(input.delivererId);

        const deliverer = await this.delivererRepository.findById(delivererId);
        if(!deliverer){
            throw new DelivererNotFoundError();
        }

        switch(input.status){
            case 'ONLINE':
                deliverer.goOnline();
                break;
            case 'OFFLINE':
                deliverer.goOffline();
                break;
            case 'BUSY':
                deliverer.setBusy();
                break;
        }

        await this.delivererRepository.update(deliverer);
    }
}