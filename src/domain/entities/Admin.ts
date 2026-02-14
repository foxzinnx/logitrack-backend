import type { Email } from "../value-objects/Email.js";
import { UUID } from "../value-objects/UUID.js";

export class Admin{
    private constructor(
        private readonly id: UUID,
        private name: string,
        private email: Email,
        private passwordHash: string,
        private isActive: boolean,
        private readonly createdAt: Date,
        private updatedAt: Date
    ){}

    static create(
        name: string,
        email: Email,
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

    static restore(
        id: UUID,
        name: string,
        email: Email,
        passwordHash: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ): Admin {
        return new Admin(
            id,
            name,
            email,
            passwordHash,
            isActive,
            createdAt,
            updatedAt
        )
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

    getEmail(): Email {
        return this.email;
    }

    getPasswordHash(): string {
        return this.passwordHash;
    }

    getIsActive(): boolean {
        return this.isActive;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}