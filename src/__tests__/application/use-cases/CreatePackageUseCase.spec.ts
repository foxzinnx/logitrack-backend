import { InMemoryPackageRepository } from "@/__tests__/mocks/repositories/InMemoryPackageRepository.js";
import { CreatePackageUseCase } from "@/application/use-cases/package/CreatePackageUseCase.js";
import { PackageStatus } from "@/domain/entities/Package.js";
import { beforeEach, describe, expect, it } from "vitest";

describe('CreatePackageUseCase', () => {
    let packageRepository: InMemoryPackageRepository;
    let sut: CreatePackageUseCase;

    beforeEach(() => {
        packageRepository = new InMemoryPackageRepository();
        sut = new CreatePackageUseCase(packageRepository);
    });

    it('should create a new package', async () => {
        const input = {
            recipientName: 'João Silva',
            recipientPhone: '(11) 99999-9999',
            street: 'Rua das Flores',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
        };

        const result = await sut.execute(input);

        expect(result.id).toBeTruthy();
        expect(result.recipientName).toBe('João Silva');
        expect(result.status).toBe(PackageStatus.PENDING);
        expect(packageRepository.items).toHaveLength(1);
    });

    it('should create package with optional complement', async () => {
        const input = {
            recipientName: 'Lula',
            recipientPhone: '(11) 99999-9999',
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 510',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
        };

        const result = await sut.execute(input);

        expect(result.address.complement).toBe('Apto 510');
    })
})