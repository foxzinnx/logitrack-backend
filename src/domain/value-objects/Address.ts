export class Address{
    private constructor(
        private readonly street: string,
        private readonly number: string,
        private readonly complement: string | null,
        private readonly neighborhood: string,
        private readonly city: string,
        private readonly state: string,
        private readonly zipCode: string
    ){}

    static create(
        street: string,
        number: string,
        neighborhood: string,
        city: string,
        state: string,
        zipCode: string,
        complement?: string
    ): Address {
        return new Address (
            street,
            number,
            complement || null,
            neighborhood,
            city,
            state,
            zipCode
        );
    }

    getFullAddress(): string {
        const comp = this.complement ? `, ${this.complement}` : '';
        return `${this.street}, ${this.number}${comp}, ${this.neighborhood}, ${this.city} - ${this.state}, ${this.zipCode}`;
    }

    getStreet(): string{
        return this.street;
    }

    getNumber(): string{
        return this.number;
    }

    getCity(): string{
        return this.city
    }

    getState(): string{
        return this.state;
    }

    getZipCode(): string {
        return this.zipCode;
    }
}