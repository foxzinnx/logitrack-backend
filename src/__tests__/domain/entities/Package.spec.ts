import { Package, PackageStatus } from "@/domain/entities/Package.js";
import { DeliveryPhotoRequiredError, PackageAlreadyAssignedError, PackageNotAssigned } from "@/domain/errors/PackageErrors.js";
import { Address } from "@/domain/value-objects/Address.js";
import { UUID } from "@/domain/value-objects/UUID.js";
import { beforeEach, describe, expect, it } from "vitest";

describe('Package Entity', () => {
    let address: Address;

    beforeEach(() => {
        address = Address.create(
            'Rua das Flores',
            '123',
            'Centro',
            'São Paulo',
            'SP',
            '01234-567'
        );
    })

    describe('create', () => {
        it('should create a package with PENDING status', () => {
            const pkg = Package.create(
                'João Silva',
                '(11) 94251-4566',
                address
            );

            expect(pkg.getStatus()).toBe(PackageStatus.PENDING);
            expect(pkg.getRecipientName()).toBe('João Silva');
            expect(pkg.getDelivererId()).toBeNull();
            expect(pkg.getDeliveryPhotoUrl()).toBeNull();
        })
    });

    describe('assignToDeliverer', () => {
        it('should assign deliverer to pending package', () => {
            const pkg = Package.create('João silva', '(42) 99495-5952', address);
            const delivererId = UUID.generate();

            pkg.assignToDeliverer(delivererId);

            expect(pkg.getDelivererId()?.equals(delivererId)).toBe(true);
            expect(pkg.getStatus()).toBe(PackageStatus.PICKED_UP);
        });

        it('should throw error when package already has deliverer', () => {
            const pkg = Package.create('João Silva', '(42) 99242-2592', address);
            const deliverer1 = UUID.generate();
            const deliverer2 = UUID.generate();

            pkg.assignToDeliverer(deliverer1);

            expect(() => pkg.assignToDeliverer(deliverer2)).toThrow(PackageAlreadyAssignedError);
        });

        it('should throw error when package status is DELIVERED', () => {
            const pkg = Package.create('João Silva', '(47) 99242-5922', address);
            const delivererId = UUID.generate();

            pkg.assignToDeliverer(delivererId);
            pkg.markAsDelivered('https://example.com/photo');

            const newDeliverer = UUID.generate();

            expect(() => pkg.assignToDeliverer(newDeliverer)).toThrow(PackageAlreadyAssignedError);
        });
    });

    describe('markAsDelivered', () => {
        it('should mark package as delivered with photo', () => {
            const pkg = Package.create('João Silva', '(42) 99242-2452', address);
            const delivererId = UUID.generate();
            const photoUrl = 'https://example.com/photo';

            pkg.assignToDeliverer(delivererId);
            pkg.markAsDelivered(photoUrl);

            expect(pkg.getStatus()).toBe(PackageStatus.DELIVERED);
            expect(pkg.getDeliveryPhotoUrl()).toBe(photoUrl);
            expect(pkg.getDeliveredAt()).toBeInstanceOf(Date);
        });

        it('should throw error when package has no deliverer', () => {
            const pkg = Package.create('João Silva', '(49) 99242-2452', address);

            expect(() => pkg.markAsDelivered('https://example.com/photo')).toThrow(PackageNotAssigned);
        });

        it('should throw error when photo URL is empty', () => {
            const pkg = Package.create('João Silva', '(42) 99922-4592', address);
            const delivererId = UUID.generate();

            pkg.assignToDeliverer(delivererId);

            expect(() => pkg.markAsDelivered('')).toThrow(DeliveryPhotoRequiredError);
        });

        it('should throw error when photo URL is whitespace', () => {
            const pkg = Package.create('João Silva', '(42) 99922-4592', address);
            const delivererId = UUID.generate();

            pkg.assignToDeliverer(delivererId);

            expect(() => pkg.markAsDelivered('  ')).toThrow(DeliveryPhotoRequiredError);
        })
    })
})