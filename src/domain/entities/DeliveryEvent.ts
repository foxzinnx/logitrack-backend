import { UUID } from "../value-objects/UUID.js";

export enum EventType {
    CREATED = 'CREATED',
    ASSIGNED = 'ASSIGNED',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    RETURNED = 'RETURNED'
}

export class DeliveryEvent {
    private constructor(
        private readonly id: UUID,
        private readonly packageId: UUID,
        private readonly eventType: EventType,
        private readonly description: string,
        private readonly createdAt: Date,
        private readonly userId?: UUID,
    ){}

    static create(
        packageId: UUID,
        eventType: EventType,
        description: string,
        userId?: UUID
    ): DeliveryEvent {
        return new DeliveryEvent(
            UUID.generate(),
            packageId,
            eventType,
            description,
            new Date()
        );
    }

    getId(): UUID {
        return this.id;
    }

    getPackageId(): UUID {
        return this.packageId;
    }

    getEventType(): EventType {
        return this.eventType;
    }

    getDescription(): string{
        return this.description;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }
}