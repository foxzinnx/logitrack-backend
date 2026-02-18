import { InvalidEmailError } from "@/domain/errors/ValueObjectsErrors.js";
import { Email } from "@/domain/value-objects/Email.js";
import { describe, expect, it } from "vitest";

describe('CPF Value Object', () => {
    it('should create a valid email', () => {
        const email = Email.create('admin@example.com');

        expect(email.getValue()).toBe('admin@example.com');
    });

    it('should normalize email to lowercase', () => {
        const email = Email.create('ADMIN@EXAMPLE.COM');

        expect(email.getValue()).toBe('admin@example.com');
    });

    it('should trim whitespace from email', () => {
        const email = Email.create(' admin@example.com ');

        expect(email.getValue()).toBe('admin@example.com');
    });

    it('should throw InvalidEmailError for email without @', () => {
        expect(() => Email.create('admin.example.com')).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email without domain', () => {
        expect(() => Email.create('admin@')).toThrow(InvalidEmailError);
    });
    
    it('should throw InvalidEmailError for empty email', () => {
        expect(() => Email.create('')).toThrow(InvalidEmailError);
    });

    it('should compare two emails correctly', () => {
        const email1 = Email.create('admin@example.com');
        const email2 = Email.create('ADMIN@EXAMPLE.COM');
        const email3 = Email.create('user@example.com');

        expect(email1.equals(email2)).toBe(true);
        expect(email1.equals(email3)).toBe(false);
    })
})