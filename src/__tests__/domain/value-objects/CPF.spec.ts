import { InvalidCPFError } from '@/domain/errors/ValueObjectsErrors.js';
import { CPF } from '@/domain/value-objects/CPF.js';
import{ describe, it, expect } from 'vitest';

describe('CPF Value Object', () => {
    it('should create a valid CPF with formatting', () => {
        const cpf = CPF.create('123.456.789-09');
    
        expect(cpf.getValue()).toBe('12345678909');
        expect(cpf.getFormatted()).toBe('123.456.789-09');
    });

    it('should create a valid CPF without formatting', () => {
        const cpf = CPF.create('12345678909');

        expect(cpf.getValue()).toBe('12345678909');
        expect(cpf.getFormatted()).toBe('123.456.789-09');
    });

    it('should throw InvalidCPFError for invalid CPF', () => {
        expect(() => CPF.create('123.456.789-00')).toThrow(InvalidCPFError);
    });

    it('should throw InvalidCPFError for CPF with repeated digits', () => {
        expect(() => CPF.create('111.111.111-11')).toThrow(InvalidCPFError);
    });

    it('should throw InvalidCPFError for CPF with wrong length', () => {
        expect(() => CPF.create('111.111.111')).toThrow(InvalidCPFError);
    });

    it('should compare two CPFs correctly', () => {
        const cpf1 = CPF.create('123.456.789-09');
        const cpf2 = CPF.create('12345678909');
        const cpf3 = CPF.create('111.444.777-35');

        expect(cpf1.equals(cpf2)).toBe(true);
        expect(cpf1.equals(cpf3)).toBe(false);
    })
})
