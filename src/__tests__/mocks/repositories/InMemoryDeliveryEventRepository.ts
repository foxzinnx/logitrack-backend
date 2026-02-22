import type { DeliveryEvent } from "@/domain/entities/DeliveryEvent.js";
import type { IDeliveryEventRepository } from "@/domain/repositories/IDeliveryEventRepository.js";
import type { UUID } from "@/domain/value-objects/UUID.js";

export class InMemoryDeliveryEventRepository implements IDeliveryEventRepository{
    public items: DeliveryEvent[] = [];
    
    async create(event: DeliveryEvent): Promise<void> {
        this.items.push(event);
    }

    async findByPackageId(packageId: UUID): Promise<DeliveryEvent[]> {
        return this.items.filter(item => item.getPackageId().equals(packageId));
    }

    async findAll(): Promise<DeliveryEvent[]> {
        return this.items;
    }

}