import type { CPF } from "../value-objects/CPF.js";
import { UUID } from "../value-objects/UUID.js";

export class Deliverer{
    private constructor(
        private readonly id: UUID,
        private name: string,
        private cpf: CPF,
        private phone: string,
        private isActive: boolean,
        private readonly createdAt: Date,
        private updatedAt: Date
    ){}

    static create(
        name: string,
        cpf: CPF,
        phone: string
    ): Deliverer {
        return new Deliverer(
            UUID.generate(),
            name,
            cpf,
            phone,
            true,
            new Date(),
            new Date()
        );
    }

    activate(): void{
        this.isActive = true;
        this.updatedAt = new Date()
    }

    deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date()
    }

    updatePhone(newPhone: string): void{
        this.phone = newPhone;
        this.updatedAt = new Date()
    }

    getId(): UUID {
        return this.id;
    }

    getName(): string{
        return this.name;
    }

    getCPF(): CPF{
        return this.cpf;
    }

    getPhone(): string{
        return this.phone;
    }

    getIsActive(): boolean {
        return this.isActive;
    }
}