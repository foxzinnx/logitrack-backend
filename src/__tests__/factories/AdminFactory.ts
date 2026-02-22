import { Admin } from "@/domain/entities/Admin.js";
import { Email } from "@/domain/value-objects/Email.js";
import { faker } from "@faker-js/faker";
import * as bcrypt from 'bcrypt';

export class AdminFactory {
    static async create(overrides?: Partial<{
        name: string;
        email: string;
        password: string;
    }>): Promise<Admin> {
        const password = overrides?.password || 'password123';
        const passwordHash = await bcrypt.hash(password, 10);

        const email = Email.create(overrides?.email || faker.internet.email());

        return Admin.create(
            overrides?.name || faker.person.fullName(),
            email,
            passwordHash
        )
    }
}