import { Deliverer } from "@/domain/entities/Deliverer.js";
import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";
import { CPF } from "@/domain/value-objects/CPF.js";

interface CreateDelivererDTO{
    name: string;
    cpf: string;
    phone: string;
}

interface DelivererResponseDTO{
    id: string;
    name: string;
    cpf: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
}

export class CreateDelivererUseCase{
    constructor(private delivererRepository: IDelivererRepository){}

    async execute(input: CreateDelivererDTO): Promise<DelivererResponseDTO> {
        const cpf = CPF.create(input.cpf);

        const existingDeliverer = await this.delivererRepository.findByCPF(cpf);

        if(existingDeliverer){
            throw new Error('Deliverer with this CPF already exists');
        }

        const deliverer = Deliverer.create(
            input.name,
            cpf,
            input.phone
        );

        await this.delivererRepository.create(deliverer);

        return {
            id: deliverer.getId().getValue(),
            name: deliverer.getName(),
            cpf: deliverer.getCPF().getFormatted(),
            phone: deliverer.getPhone(),
            isActive: deliverer.getIsActive(),
            createdAt: deliverer.getCreatedAt()
        }
    }
}