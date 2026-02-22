import type { Package } from "../entities/Package.js";
import type { UUID } from "../value-objects/UUID.js";

export interface IPackageRepository {
    create(pkg: Package): Promise<void>;
    findById(id: UUID): Promise<Package | null>;
    findByDelivererId(delivererId: UUID): Promise<Package[]>;
    findAll(): Promise<Package[]>;
    findPending(): Promise<Package[]>;
    update(pkg: Package): Promise<void>;
    delete(id: UUID): Promise<void>;
}