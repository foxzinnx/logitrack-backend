import type { CPF } from "../value-objects/CPF.js";
import { UUID } from "../value-objects/UUID.js";

export enum DelivererStatus {
    OFFLINE = 'OFFLINE',
    ONLINE = 'ONLINE',
    BUSY = 'BUSY'
}

export class Deliverer{
    private constructor(
        private readonly id: UUID,
        private name: string,
        private cpf: CPF,
        private phone: string,
        private passwordHash: string,
        private status: DelivererStatus,
        private isActive: boolean,
        private readonly createdAt: Date,
        private updatedAt: Date
    ){}

    static create(
        name: string,
        cpf: CPF,
        phone: string,
        passwordHash: string
    ): Deliverer {
        return new Deliverer(
            UUID.generate(),
            name,
            cpf,
            phone,
            passwordHash,
            DelivererStatus.OFFLINE,
            true,
            new Date(),
            new Date()
        );
    }

    static restore(
        id: UUID,
        name: string,
        cpf: CPF,
        phone: string,
        passwordHash: string,
        status: DelivererStatus,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ): Deliverer{
        return new Deliverer(
            id,
            name,
            cpf,
            phone,
            passwordHash,
            status,
            isActive,
            createdAt,
            updatedAt
        )
    }

    goOnline(): void {
        if (!this.isActive) {
            throw new Error('Inactive deliverer cannot go online');
        }
        this.status = DelivererStatus.ONLINE;
        this.updatedAt = new Date();
    }

    goOffline(): void {
        this.status = DelivererStatus.OFFLINE;
        this.updatedAt = new Date();
    }

    setBusy(): void {
        this.status = DelivererStatus.BUSY;
        this.updatedAt = new Date();
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

    changePassword(newPasswordHash: string): void {
        this.passwordHash = newPasswordHash;
        this.updatedAt = new Date();
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

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    isAvailable(): boolean{
        return this.isActive && this.status === DelivererStatus.ONLINE;
    }
}