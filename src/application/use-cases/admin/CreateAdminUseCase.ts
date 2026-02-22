import { Admin } from "@/domain/entities/Admin.js";
import { InvalidCredentialsError } from "@/domain/errors/AdminErrors.js";
import type { IAdminRepository } from "@/domain/repositories/IAdminRepository.js";
import { Email } from "@/domain/value-objects/Email.js";
import * as bcrypt from 'bcrypt';

interface CreateAdminDTO{
    name: string;
    email: string;
    password: string;
}

interface AdminResponseDTO{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
}

export class CreateAdminUseCase{
    constructor(private adminRepository: IAdminRepository){}

    async execute(input: CreateAdminDTO): Promise<AdminResponseDTO>{
        const email = Email.create(input.email);

        const existingAdmin = await this.adminRepository.findByEmail(email);
        if(existingAdmin){
            throw new InvalidCredentialsError();
        }

        const passwordHash = await bcrypt.hash(input.password, 10);

        const admin = Admin.create(
            input.name,
            email,
            passwordHash
        )

        await this.adminRepository.create(admin);

        return {
            id: admin.getId().getValue(),
            name: admin.getName(),
            email: admin.getEmail().getValue(),
            isActive: admin.getIsActive(),
            createdAt: admin.getCreatedAt()
        }
    }
}