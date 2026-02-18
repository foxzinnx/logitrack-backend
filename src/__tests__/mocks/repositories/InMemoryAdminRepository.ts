import type { Admin } from "@/domain/entities/Admin.js";
import type { IAdminRepository } from "@/domain/repositories/IAdminRepository.js";
import type { Email } from "@/domain/value-objects/Email.js";
import type { UUID } from "@/domain/value-objects/UUID.js";

export class InMemoryAdminRepository implements IAdminRepository {
    public items: Admin[] = [];
    
    async create(admin: Admin): Promise<void> {
        this.items.push(admin);
    }

    async findById(id: UUID): Promise<Admin | null> {
        const admin = this.items.find(item => item.getId().equals(id));
        return admin || null;
    }

    async findByEmail(email: Email): Promise<Admin | null> {
        const admin = this.items.find(item => item.getEmail().equals(email));
        return admin || null;
    }

    async findAll(): Promise<Admin[]> {
        return this.items;
    }

    async update(admin: Admin): Promise<void> {
        const index = this.items.findIndex(item => item.getId().equals(admin.getId()));

        if(index !== -1){
            this.items[index] = admin;
        }
    }

    async delete(id: UUID): Promise<void> {
        const index = this.items.findIndex(item => item.getId().equals(id));
        if(index !== -1){
            this.items.splice(index, 1);
        }
    }

}