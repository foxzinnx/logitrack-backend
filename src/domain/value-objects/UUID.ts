import { randomUUID } from 'node:crypto'
import { InvalidUUIDError } from '../errors/ValueObjectsErrors.js';

export class UUID{
    private constructor(private readonly value: string){
        if(!this.isValid(value)) throw new InvalidUUIDError();
    }

    static generate(): UUID {
        return new UUID(randomUUID());
    }

    static create(value: string): UUID {
        return new UUID(value);
    }

    private isValid(value: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        return uuidRegex.test(value);
    }

    getValue(): string{
        return this.value;
    }

    equals(other: UUID): boolean {
        return this.value === other.value;
    }
}