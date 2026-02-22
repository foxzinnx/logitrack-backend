import type { Admin } from "../entities/Admin.js";
import type { Email } from "../value-objects/Email.js";
import type { UUID } from "../value-objects/UUID.js";

export interface IAdminRepository {
    create(admin: Admin): Promise<void>;
    findById(id: UUID): Promise<Admin | null>;
    findByEmail(email: Email): Promise<Admin | null>;
    findAll(): Promise<Admin[]>;
    update(admin: Admin): Promise<void>;
    delete(id: UUID): Promise<void>;
}