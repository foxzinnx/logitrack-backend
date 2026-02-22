import { PackageStatus, type Package } from "@/domain/entities/Package.js";
import type { IPackageRepository } from "@/domain/repositories/IPackageRepository.js";
import type { UUID } from "@/domain/value-objects/UUID.js";

export class InMemoryPackageRepository implements IPackageRepository {
    public items: Package[] = [];
    
    async create(pkg: Package): Promise<void> {
        this.items.push(pkg);
    }
    async findById(id: UUID): Promise<Package | null> {
        const pkg = this.items.find(item => item.getId().equals(id));
        return pkg || null;
    }

    async findByDelivererId(delivererId: UUID): Promise<Package[]> {
        return this.items.filter(item => {
            const pkgDeliverer = item.getDelivererId();
            return pkgDeliverer && pkgDeliverer.equals(delivererId);
        });
    }

    async findAll(): Promise<Package[]> {
        return this.items;
    }

    async findPending(): Promise<Package[]> {
        return this.items.filter(item => {
            item.getStatus() === PackageStatus.PENDING ||
            item.getStatus() === PackageStatus.AWAITING_PICKUP
        });
    }

    async update(pkg: Package): Promise<void> {
        const index = this.items.findIndex(item => item.getId().equals(pkg.getId()));

        if(index !== -1){
            this.items[index] = pkg;
        }
    }

    async delete(id: UUID): Promise<void> {
        const index = this.items.findIndex(item => item.getId().equals(id));

        if(index !== -1){
            this.items.splice(index, 1);
        }
    }
}