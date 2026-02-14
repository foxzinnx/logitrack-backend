import { UUID } from "../value-objects/UUID.js";

export class Admin{
    private constructor(
        private readonly id: UUID,
        private name: string,
        private email: string,
        private passwordHash: string,
        private isActive: boolean,
        private readonly createdAt: Date,
        private updatedAt: Date
    ){}

    static create(
        name: string,
        email: string,
        passwordHash: string
    ): Admin {
        return new Admin(
            UUID.generate(),
            name,
            email,
            passwordHash,
            true,
            new Date(),
            new Date()
        );
    }

    changePassword(newPasswordHash: string): void {
        this.passwordHash = newPasswordHash;
        this.updatedAt = new Date();
    }

    deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date()
    }

    getId(): UUID {
        return this.id;
    }

    getName(): string{
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getPasswordHash(): string {
        return this.passwordHash;
    }

    getIsActive(): boolean {
        return this.isActive;
    }
}