import { InvalidCPFError } from "../errors/ValueObjectsErrors.js";

export class CPF{
    private readonly value: string;

    constructor(value: string){
        const cleanedCPF = this.clean(value);

        if(!this.isValid(cleanedCPF)) throw new InvalidCPFError();

        this.value = cleanedCPF;
    }

    static create(value: string): CPF {
        return new CPF(value);
    }

    private clean(cpf: string): string {
        return cpf.replace(/\D/g, '');
    }

    private isValid(cpf: string): boolean {
        if (cpf.length !== 11) {
          return false;
        }

        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }


        let sum = 0;

        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let firstDigit = 11 - (sum % 11);

        if (firstDigit >= 10) firstDigit = 0;

        if (parseInt(cpf.charAt(9)) !== firstDigit) {
            return false;
        }

        sum = 0;

        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }

        let secondDigit = 11 - (sum % 11);
        if (secondDigit >= 10) secondDigit = 0;

        if (parseInt(cpf.charAt(10)) !== secondDigit) {
            return false;
        }

        return true;
    }

    getValue(): string {
        return this.value;
    }

    getFormatted(): string {
        return this.value.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            '$1.$2.$3-$4'
        );
    }

    equals(other: CPF): boolean {
        return this.value === other.value;
    }

    toString(): string{
        return this.getFormatted();
    }
}