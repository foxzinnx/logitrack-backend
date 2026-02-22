import type { Deliverer } from "../entities/Deliverer.js";
import type { CPF } from "../value-objects/CPF.js";
import type { UUID } from "../value-objects/UUID.js";

export interface IDelivererRepository {
    create(deliverer: Deliverer): Promise<void>;
    findById(id: UUID): Promise<Deliverer | null>;
    findByCPF(cpf: CPF): Promise<Deliverer | null>;
    findAll(): Promise<Deliverer[]>;
    findAllActive(): Promise<Deliverer[]>;
    update(deliverer: Deliverer): Promise<void>;
    delete(id: UUID): Promise<void>;
}