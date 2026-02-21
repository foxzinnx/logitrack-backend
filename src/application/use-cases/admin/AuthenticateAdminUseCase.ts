import type { ITokenProvider } from "@/application/providers/ITokenProvider.js";
import { AdminNotActiveError, InvalidCredentialsError } from "@/domain/errors/AdminErrors.js";
import type { IAdminRepository } from "@/domain/repositories/IAdminRepository.js";
import { Email } from "@/domain/value-objects/Email.js";
import { compare } from "bcrypt";

interface AuthenticateAdminDTO {
    email: string;
    password: string;
}

interface AuthResponseDTO{
    admin: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}


export class AuthenticateAdminUseCase{
    constructor(private adminRepository: IAdminRepository, private tokenProvider: ITokenProvider){}

    async execute(input: AuthenticateAdminDTO): Promise<AuthResponseDTO> {
        const email = Email.create(input.email);

        const admin = await this.adminRepository.findByEmail(email);
        if(!admin){
            throw new InvalidCredentialsError()
        }

        if(!admin.getIsActive()){
            throw new AdminNotActiveError()
        }

        const isPasswordValid = await compare(
            input.password,
            admin.getPasswordHash()
        );

        if(!isPasswordValid){
            throw new InvalidCredentialsError()
        }

        const token = this.tokenProvider.generate({
            userId: admin.getId().getValue(),
            role: 'admin',
            email: admin.getEmail().getValue()
        })

        return {
            admin: {
                id: admin.getId().getValue(),
                name: admin.getName(),
                email: admin.getEmail().getValue()
            },
            token
        }
    }
}