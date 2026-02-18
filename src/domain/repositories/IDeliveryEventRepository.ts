import type { DeliveryEvent } from "../entities/DeliveryEvent.js";
import type { UUID } from "../value-objects/UUID.js";

export interface IDeliveryEventRepository{
    create(event: DeliveryEvent): Promise<void>;
    findByPackageId(packageId: UUID): Promise<DeliveryEvent[]>;
    findAll(): Promise<DeliveryEvent[]>;
}