import { DomainError } from "./DomainError.js";

export class InvalidCPFError extends DomainError {
    constructor(){
        super('Invalid CPF Format');
    }
}

export class InvalidEmailError extends DomainError {
    constructor(){
        super('Invalid email address');
    }
}

export class InvalidUUIDError extends DomainError {
    constructor(){
        super('Invalid UUID format');
    }
}