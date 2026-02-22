import { InvalidUUIDError } from "@/domain/errors/ValueObjectsErrors.js";
import { UUID } from "@/domain/value-objects/UUID.js";
import { describe, expect, it } from "vitest";

describe('UUID Value Object', () => {
    it('should generate a valid UUID', () => {
        const uuid = UUID.generate();

        expect(uuid.getValue()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    });

    it('should create UUID from valid string', () => {
        const validUUID = '550e8400-e29b-41d4-a716-446655440000';
        const uuid = UUID.create(validUUID);

        expect(uuid.getValue()).toBe(validUUID);
    });

    it('should throw InvalidUUIDError for invalid format', () => {
        expect(() => UUID.create('invalid-uuid-format')).toThrow(InvalidUUIDError);
    });

    it('should compare two UUIDs correctly', () => {
        const uuid1 = UUID.create('550e8400-e29b-41d4-a716-446655440000');
        const uuid2 = UUID.create('550e8400-e29b-41d4-a716-446655440000');
        const uuid3 = UUID.create('660e8400-e29b-41d4-a716-446655440000');

        expect(uuid1.equals(uuid2)).toBe(true);
        expect(uuid1.equals(uuid3)).toBe(false);
    })
})