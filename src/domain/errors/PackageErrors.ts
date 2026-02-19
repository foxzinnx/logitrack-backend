import { DomainError } from "./DomainError.js";

export class PackageNotFoundError extends DomainError {
    constructor(packageId?: string){
        super(packageId ? `Package not found: ${packageId}` : 'Package not found');
    }
}

export class PackageAlreadyAssignedError extends DomainError {
    constructor(){
        super(`Package is already assigned to a driver`);
    }
}

export class PackageCannotBeAssignedError extends DomainError {
    constructor(currentStatus?: string){
        super(currentStatus ? `Package cannot be assigned in current status: ${currentStatus}` : 'Package cannot be assigned in current status');
    }
}

export class PackageCannotBeDeliveredError extends DomainError {
    constructor(reason: string){
        super(`Package cannot be delivered: ${reason}`);
    }
}

export class DeliveryPhotoRequiredError extends DomainError{
    constructor(){
        super('Delivery photo is required to mark package as delivered');
    }
}

export class PackageNotAssignedError extends DomainError{
    constructor(){
        super('Package must be assigned to a deliverer before delivery');
    }
}

export class InvalidStatusTransitionError extends DomainError {
    constructor(from: string, to: string){
        super(`Cannot transition package status from ${from} to ${to}`);
    }
}