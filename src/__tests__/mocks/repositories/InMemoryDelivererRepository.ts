import type { Deliverer } from "@/domain/entities/Deliverer.js";
import type { IDelivererRepository } from "@/domain/repositories/IDelivererRepository.js";
import type { CPF } from "@/domain/value-objects/CPF.js";
import type { UUID } from "@/domain/value-objects/UUID.js";

export class InMemoryDelivererRepository implements IDelivererRepository {
    public items: Deliverer[] = [];
    
    async create(deliverer: Deliverer): Promise<void> {
        this.items.push(deliverer);
    }
    
    async findById(id: UUID): Promise<Deliverer | null> {
        const deliverer = this.items.find(item => item.getId().equals(id));
        return deliverer || null;
    }

    async findByCPF(cpf: CPF): Promise<Deliverer | null> {
        const deliverer = this.items.find(item => item.getCPF().equals(cpf));
        return deliverer || null;
    }

    async findAll(): Promise<Deliverer[]> {
        return this.items;
    }

    async findAllActive(): Promise<Deliverer[]> {
        return this.items.filter(item => item.getIsActive());
    }

    async update(deliverer: Deliverer): Promise<void> {
        const index = this.items.findIndex(item => item.getId().equals(deliverer.getId()));
        if(index !== -1){
            this.items[index] = deliverer;
        }
    }

    async delete(id: UUID): Promise<void> {
        const index = this.items.findIndex(item => item.getId().equals(id));

        if(index !== -1){
            this.items.splice(index, 1);
        }
    }

}