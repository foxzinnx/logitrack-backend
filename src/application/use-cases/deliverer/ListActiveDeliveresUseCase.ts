import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";

interface DeliveresResponseDTO{
    id: string;
    name: string;
    cpf: string;
    phone: string;
    isActive: boolean;
}

export class ListActiveDeliveresUseCase{
    constructor(private deliveresRepository: IDelivererRepository){}

    async execute(): Promise<DeliveresResponseDTO[]>{
        const deliveres = await this.deliveresRepository.findAllActive();

        return deliveres.map(deliverer => ({
            id: deliverer.getId().getValue(),
            name: deliverer.getName(),
            cpf: deliverer.getCPF().getFormatted(),
            phone: deliverer.getPhone(),
            isActive: deliverer.getIsActive()
        }))
    }
}