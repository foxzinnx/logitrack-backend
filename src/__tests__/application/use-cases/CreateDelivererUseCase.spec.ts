import { InMemoryDelivererRepository } from "@/__tests__/mocks/repositories/InMemoryDelivererRepository.js";
import { CreateDelivererUseCase } from "@/application/use-cases/deliverer/CreateDelivererUseCase.js";
import { DelivererAlreadyExistsError } from "@/domain/errors/DelivererErrors.js";
import { InvalidCPFError } from "@/domain/errors/ValueObjectsErrors.js";
import { beforeEach, describe, expect, it } from "vitest";

describe('CreateDelivererUseCase', () => {
    let delivererRepository: InMemoryDelivererRepository;
    let sut: CreateDelivererUseCase;

    beforeEach(() => {
        delivererRepository = new InMemoryDelivererRepository();
        sut = new CreateDelivererUseCase(delivererRepository);
    });

    it('should create a new deliverer', async () => {
        const input = {
            name: 'João entregador',
            cpf: '123.456.789-09',
            phone: '(11) 99999-9999'
        }

        const result = await sut.execute(input);

        expect(result.id).toBeTruthy();
        expect(result.name).toBe('João entregador');
        expect(result.cpf).toBe('123.456.789-09');
        expect(result.isActive).toBe(true);
        expect(delivererRepository.items).toHaveLength(1);
    });

    it('should throw error when CPF already exist', async () => {
        const input = {
            name: 'João Entregador',
            cpf: '123.456.789-09',
            phone: '(11) 99999-9999'
        };

        await sut.execute(input);

        await expect(sut.execute(input)).rejects.toThrow(DelivererAlreadyExistsError);
    });

    it('should throw error when CPF is invalid', async () => {
        const input = {
            name: 'João Entregador',
            cpf: '123.456.789-00',
            phone: '(11) 99999-9999'
        };

        await expect(sut.execute(input)).rejects.toThrow(InvalidCPFError);
    })
})