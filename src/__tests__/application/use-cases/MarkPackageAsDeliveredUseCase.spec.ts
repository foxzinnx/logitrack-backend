import { PackageFactory } from "@/__tests__/factories/PackageFactory.js";
import { InMemoryPackageRepository } from "@/__tests__/mocks/repositories/InMemoryPackageRepository.js";
import { MarkPackageAsDeliveredUseCase } from "@/application/use-cases/package/MarkPackageAsDeliveredUseCase.js";
import { PackageStatus } from "@/domain/entities/Package.js";
import { DeliveryPhotoRequiredError, PackageNotAssigned, PackageNotFoundError } from "@/domain/errors/PackageErrors.js";
import { UUID } from "@/domain/value-objects/UUID.js";
import { beforeEach, describe, expect, it } from "vitest";

describe('MarkPackageAsDeliveredUseCase', () => {
    let packageRepository: InMemoryPackageRepository;
    let sut: MarkPackageAsDeliveredUseCase;

    beforeEach(() => {
        packageRepository = new InMemoryPackageRepository();
        sut = new MarkPackageAsDeliveredUseCase(packageRepository);
    });

    it('should mark package as delivered with photo', async () => {
        const pkg = PackageFactory.create();
        const delivererId = UUID.generate();

        pkg.assignToDeliverer(delivererId);
        await packageRepository.create(pkg);

        const photoUrl = 'https://example.com/photo.png';

        const result = await sut.execute({
            packageId: pkg.getId().getValue(),
            photoUrl
        });

        expect(result.status).toBe(PackageStatus.DELIVERED);
        expect(result.deliveryPhotoUrl).toBe(photoUrl);
        expect(result.deliveredAt).toBeInstanceOf(Date);
    });

    it('should throw error when package does not exist', async () => {
        const fakePackageId = '550e8400-e29b-41d4-a716-446655440000';

        await expect(sut.execute({
            packageId: fakePackageId,
            photoUrl: 'https://example.com/photo.png'
        })).rejects.toThrow(PackageNotFoundError);
    });

    it('should throw error when package has no deliverer assigned', async () => {
        const pkg = PackageFactory.create();
        await packageRepository.create(pkg);

        await expect(sut.execute({
            packageId: pkg.getId().getValue(),
            photoUrl: 'https://example.com/photo.png'
        })).rejects.toThrow(PackageNotAssigned);
    });

    it('should throw error when photo url is empty', async () => {
        const pkg = PackageFactory.create();
        const delivererId = UUID.generate();

        pkg.assignToDeliverer(delivererId);
        await packageRepository.create(pkg);

        await expect(sut.execute({
            packageId: pkg.getId().getValue(),
            photoUrl: ''
        })).rejects.toThrow(DeliveryPhotoRequiredError);
    })
})