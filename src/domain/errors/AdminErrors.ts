import { DomainError } from "./DomainError.js";

export class AdminNotFound extends DomainError {
    constructor(){
        super('Admin not found');
    }
}

export class AdminAlreadyExistsError extends DomainError {
    constructor(email: string){
        super(`Admin with email ${email} already exists`);
    }
}

export class InvalidCredentialsError extends DomainError {
    constructor(){
        super('Invalid credentials');
    }
}

export class AdminNotActiveError extends DomainError{
    constructor(){
        super('Admin account is inactive');
    }
}