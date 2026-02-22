import { Package } from "@/domain/entities/Package.js";
import { Address } from "@/domain/value-objects/Address.js";
import { faker } from '@faker-js/faker';

export class PackageFactory{
    static create(overrides?: Partial<{
        recipientName: string;
        recipientPhone: string;
        street: string;
        number: string;
        city: string;
        state: string;
        zipCode: string;
    }>): Package {
        const address = Address.create(
            overrides?.street || faker.location.street(),
            overrides?.number || faker.location.buildingNumber(),
            faker.location.secondaryAddress(),
            overrides?.city || faker.location.city(),
            overrides?.state || faker.location.state(),
            overrides?.zipCode || faker.location.zipCode()
        )

        return Package.create(
            overrides?.recipientName || faker.person.fullName(),
            overrides?.recipientPhone || faker.phone.number(),
            address
        );
    }
}