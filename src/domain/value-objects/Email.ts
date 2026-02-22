import { InvalidEmailError } from "../errors/ValueObjectsErrors.js";

export class Email{
    private readonly value: string;

    private constructor(value: string){
        const cleanedEmail = value.trim().toLowerCase();

        if(!this.isValid(cleanedEmail)){
            throw new InvalidEmailError()
        }

        this.value = cleanedEmail;
    }

    static create(value: string): Email {
        return new Email(value);
    }

    private isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return false;
        }

        if(email.length > 254){
            return false;
        }

        const [localPart, domain] = email.split('@') as [string, string];

        if(localPart.length > 64){
            return false;
        }

        if(domain.length > 253){
            return false;
        }

        return true;
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean{
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}