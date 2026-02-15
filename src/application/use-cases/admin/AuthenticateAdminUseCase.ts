import type { IAdminRepository } from "@/domain/repositories/IAdminRepository.js";
import { Email } from "@/domain/value-objects/Email.js";
import { compare } from "bcrypt";

interface AuthenticateAdminDTO {
    email: string;
    password: string;
}

interface AuthResponseDTO{
    id: string;
    name: string;
    email: string;
}


export class AuthenticateAdminUseCase{
    constructor(private adminRepository: IAdminRepository){}

    async execute(input: AuthenticateAdminDTO): Promise<AuthResponseDTO> {
        const email = Email.create(input.email);

        const admin = await this.adminRepository.findByEmail(email);
        if(!admin){
            throw new Error('Invalid credentials');
        }

        if(!admin.getIsActive()){
            throw new Error('Admin account is inactive');
        }

        const isPasswordValid = await compare(
            input.password,
            admin.getPasswordHash()
        );

        if(!isPasswordValid){
            throw new Error('Invalid credentials');
        }

        return {
            id: admin.getId().getValue(),
            name: admin.getName(),
            email: admin.getEmail().getValue()
        }
    }
}