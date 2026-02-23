import type { AuthenticateDelivererDTO } from "@/application/dtos/AuthenticateDelivererDTO.js";
import type { AuthResponseDTO } from "@/application/dtos/AuthResponseDTO.js";
import type { ITokenProvider } from "@/application/providers/ITokenProvider.js";
import { InvalidCredentialsError } from "@/domain/errors/AdminErrors.js";
import { DelivererNotActiveError } from "@/domain/errors/DelivererErrors.js";
import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";
import { CPF } from "@/domain/value-objects/CPF.js";
import * as bcrypt from 'bcrypt';

export class AuthenticateDelivererUseCase {
    constructor(
        private delivererRepository: IDelivererRepository,
        private tokenProvider: ITokenProvider
    ){}

    async execute(input: AuthenticateDelivererDTO): Promise<AuthResponseDTO> {
        const cpf = CPF.create(input.cpf);

        const deliverer = await this.delivererRepository.findByCPF(cpf);
        if(!deliverer){
            throw new InvalidCredentialsError();
        }

        if(!deliverer.getIsActive()){
            throw new DelivererNotActiveError();
        }

        const isPasswordValid = await bcrypt.compare(input.password, deliverer.getPasswordHash());

        if(!isPasswordValid){
            throw new InvalidCredentialsError();
        }

        deliverer.goOnline();
        await this.delivererRepository.update(deliverer);

        const token = this.tokenProvider.generate({
            userId: deliverer.getId().getValue(),
            role: 'deliverer',
            email: ''
        });

        return {
            deliverer: {
                id: deliverer.getId().getValue(),
                name: deliverer.getName(),
                cpf: deliverer.getCPF().getFormatted(),
                phone: deliverer.getPhone(),
                status: deliverer.getStatus()
            },
            token
        }
    }
}