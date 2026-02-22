import { DomainError } from "./DomainError.js";

export class DelivererNotFoundError extends DomainError{
    constructor(delivererId?: string){
        super(delivererId ? `Deliverer not found: ${delivererId}` : 'Deliverer not found');
    }
}

export class DelivererAlreadyExistsError extends DomainError{
    constructor(cpf: string){
        super(`Deliverer with CPF ${cpf} already exists`);
    }
}

export class DelivererNotActiveError extends DomainError {
    constructor(){
        super('Deliverer is not active');
    }
}