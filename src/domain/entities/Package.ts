import type { Address } from '../value-objects/Address.js';
import { UUID } from '../value-objects/UUID.js'

export enum PackageStatus{
    PENDING = 'PENDING',
    AWAITING_PICKUP = 'AWAITING_PICKUP',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    RETURNED = 'RETURNED'
}

export class Package{
    private constructor(
        private readonly id: UUID,
        private recipientName: string,
        private recipientPhone: string,
        private deliveryAddress: Address,
        private status: PackageStatus,
        private readonly createdAt: Date,
        private updatedAt: Date,
        private delivererId: UUID | null,
        private deliveryPhotoUrl: string | null,
        private deliveryAt: Date | null,
    ){}

    static create(recipientName: string, recipientPhone: string, deliveryAddress: Address): Package {
        return new Package(
            UUID.generate(),
            recipientName,
            recipientPhone,
            deliveryAddress,
            PackageStatus.PENDING,
            new Date(),
            new Date(),
            null,
            null,
            null
        )
    }

    static restore(
        id: UUID,
        recipientName: string,
        recipientPhone: string,
        deliveryAddress: Address,
        status: PackageStatus,
        delivererId: UUID | null,
        deliveryPhotoUrl: string | null,
        deliveredAt: Date | null,
        createdAt: Date,
        updatedAt: Date
    ){
        return new Package(
            id,
            recipientName,
            recipientPhone,
            deliveryAddress,
            status,
            createdAt,
            updatedAt,
            delivererId,
            deliveryPhotoUrl,
            deliveredAt
        )
    }

    assignToDeliverer(delivererId: UUID): void{
        if(this.status !== PackageStatus.PENDING && this.status !== PackageStatus.AWAITING_PICKUP){
            throw new Error('Package cannot be assigned in current status');
        }

        this.delivererId = delivererId;
        this.status = PackageStatus.PICKED_UP;
        this.updatedAt = new Date();
    }

    markAsDelivered(photoUrl: string): void{
        if(!this.delivererId){
            throw new Error('Package must be assigned to a deliverer');
        }

        if(!photoUrl || photoUrl.trim() === ''){
            throw new Error('Delivery photo is required');
        }

        if(this.status !== PackageStatus.PICKED_UP && this.status !== PackageStatus.IN_TRANSIT){
            throw new Error('Package cannot be delivered in current status');
        }

        this.deliveryPhotoUrl = photoUrl;
        this.status = PackageStatus.DELIVERED;
        this.deliveryAt = new Date();
        this.updatedAt = new Date();
    }

    updateStatus(newStatus: PackageStatus): void {
        this.status = newStatus;
        this.updatedAt = new Date();
    }

    getId(): UUID{
        return this.id;
    }

    getStatus(): PackageStatus{
        return this.status;
    }

    getDelivererId(): UUID | null {
        return this.delivererId;
    }

    getDeliveryPhotoUrl(): string | null {
        return this.deliveryPhotoUrl;
    }

    getRecipientName(): string{
        return this.recipientName;
    }

    getDeliveryAddress(): Address {
        return this.deliveryAddress;
    }

    getDeliveredAt(): Date | null {
        return this.deliveryAt;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}