import type { CreateDelivererDTO } from "@/application/dtos/CreateDelivererDTO.js";
import type { DelivererResponseDTO } from "@/application/dtos/DelivererResponseDTO.js";
import { Deliverer } from "@/domain/entities/Deliverer.js";
import { DelivererAlreadyExistsError } from "@/domain/errors/DelivererErrors.js";
import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";
import { CPF } from "@/domain/value-objects/CPF.js";
import * as bcrypt from 'bcrypt';

export class CreateDelivererUseCase{
    constructor(private delivererRepository: IDelivererRepository){}

    async execute(input: CreateDelivererDTO): Promise<DelivererResponseDTO> {
        const cpf = CPF.create(input.cpf);

        const existingDeliverer = await this.delivererRepository.findByCPF(cpf);

        if(existingDeliverer){
            throw new DelivererAlreadyExistsError(cpf.toString());
        }

        const passwordHash = await bcrypt.hash(input.password, 10);

        const deliverer = Deliverer.create(
            input.name,
            cpf,
            input.phone,
            passwordHash
        );

        await this.delivererRepository.create(deliverer);

        return {
            id: deliverer.getId().getValue(),
            name: deliverer.getName(),
            cpf: deliverer.getCPF().getFormatted(),
            phone: deliverer.getPhone(),
            status: deliverer.getStatus(),
            isActive: deliverer.getIsActive(),
            createdAt: deliverer.getCreatedAt()
        }
    }
}