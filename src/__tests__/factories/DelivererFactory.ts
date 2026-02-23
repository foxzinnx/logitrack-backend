import { Deliverer } from "@/domain/entities/Deliverer.js";
import { CPF } from "@/domain/value-objects/CPF.js";
import { faker } from "@faker-js/faker";

export class DelivererFactory {
    static create(overrides?: Partial<{
        name: string;
        cpf: string;
        phone: string;
        password: string;
    }>): Deliverer {
        const validCPF = overrides?.cpf || '307.677.020-93';
        const passwordHash = overrides?.password || 'password123';

        return Deliverer.create(
            overrides?.name || faker.person.fullName(),
            CPF.create(validCPF),
            passwordHash,
            overrides?.phone || faker.phone.number()
        )
    }
}