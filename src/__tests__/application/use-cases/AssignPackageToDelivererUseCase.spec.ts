import { DelivererFactory } from "@/__tests__/factories/DelivererFactory.js";
import { PackageFactory } from "@/__tests__/factories/PackageFactory.js";
import { InMemoryDelivererRepository } from "@/__tests__/mocks/repositories/InMemoryDelivererRepository.js";
import { InMemoryPackageRepository } from "@/__tests__/mocks/repositories/InMemoryPackageRepository.js";
import { AssignPackageToDelivererUseCase } from "@/application/use-cases/package/AssignPackageToDelivererUseCase.js";
import { PackageStatus } from "@/domain/entities/Package.js";
import { DelivererNotActiveError, DelivererNotFoundError } from "@/domain/errors/DelivererErrors.js";
import { PackageNotFoundError } from "@/domain/errors/PackageErrors.js";
import { beforeEach, describe, expect, it } from "vitest";

describe('AssignPackageToDelivererUseCase', () => {
    let packageRepository: InMemoryPackageRepository;
    let delivererRepository: InMemoryDelivererRepository;
    let sut: AssignPackageToDelivererUseCase;

    beforeEach(() => {
        packageRepository = new InMemoryPackageRepository();
        delivererRepository = new InMemoryDelivererRepository();
        sut = new AssignPackageToDelivererUseCase(packageRepository, delivererRepository);
    });

    it('should assign package to deliverer', async () => {
        const pkg = PackageFactory.create();
        const deliverer = DelivererFactory.create();

        await packageRepository.create(pkg);
        await delivererRepository.create(deliverer);

        const result = await sut.execute({
            packageId: pkg.getId().getValue(),
            delivererId: deliverer.getId().getValue()
        });

        expect(result.delivererId).toBe(deliverer.getId().getValue());
        expect(result.status).toBe(PackageStatus.PICKED_UP);
    });

    it('should throw error when package does not exist', async () => {
        const deliverer = DelivererFactory.create();
        await delivererRepository.create(deliverer);

        const fakePackageId = "550e8400-e29b-41d4-a716-446655440000";

        await expect(sut.execute({
            packageId: fakePackageId,
            delivererId: deliverer.getId().getValue()
        })).rejects.toThrow(PackageNotFoundError);
    });

    it('should throw error when deliverer does not exist', async () => {
        const pkg = PackageFactory.create();
        await packageRepository.create(pkg);

        const fakeDelivererId = '550e8400-e29b-41d4-a716-446655440000';

        await expect(sut.execute({
            packageId: pkg.getId().getValue(),
            delivererId: fakeDelivererId
        })).rejects.toThrow(DelivererNotFoundError);
    });

    it('should throw error when deliverer is not active', async () => {
        const pkg = PackageFactory.create();
        const deliverer = DelivererFactory.create();

        deliverer.deactivate();

        await packageRepository.create(pkg);
        await delivererRepository.create(deliverer);

        await expect(sut.execute({
            packageId: pkg.getId().getValue(),
            delivererId: deliverer.getId().getValue()
        })).rejects.toThrow(DelivererNotActiveError);
    })
})