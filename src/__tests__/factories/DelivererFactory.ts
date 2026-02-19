import { Deliverer } from "@/domain/entities/Deliverer.js";
import { CPF } from "@/domain/value-objects/CPF.js";
import { faker } from "@faker-js/faker";

export class DelivererFactory {
    static create(overrides?: Partial<{
        name: string;
        cpf: string;
        phone: string;
    }>): Deliverer {
        const validCPF = overrides?.cpf || '307.677.020-93';

        return Deliverer.create(
            overrides?.name || faker.person.fullName(),
            CPF.create(validCPF),
            overrides?.phone || faker.phone.number()
        )
    }
}