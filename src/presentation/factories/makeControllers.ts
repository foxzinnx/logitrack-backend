import { AuthenticateAdminUseCase } from "@/application/use-cases/admin/AuthenticateAdminUseCase.js";
import { CreateAdminUseCase } from "@/application/use-cases/admin/CreateAdminUseCase.js";
import { CreateDelivererUseCase } from "@/application/use-cases/deliverer/CreateDelivererUseCase.js";
import { ListActiveDeliveresUseCase } from "@/application/use-cases/deliverer/ListActiveDeliveresUseCase.js";
import { AssignPackageToDelivererUseCase } from "@/application/use-cases/package/AssignPackageToDelivererUseCase.js";
import { CreatePackageUseCase } from "@/application/use-cases/package/CreatePackageUseCase.js";
import { GetPackageDetailsUseCase } from "@/application/use-cases/package/GetPackageDetailsUseCase.js";
import { ListPackagesByDelivererUseCase } from "@/application/use-cases/package/ListPackagesByDelivererUseCase.js";
import { MarkPackageAsDeliveredUseCase } from "@/application/use-cases/package/MarkPackageAsDeliveredUseCase.js";
import type { PrismaClient } from "@/generated/prisma/client.js";
import { PrismaAdminRepository } from "@/infra/database/repositories/PrismaAdminRepository.js";
import { PrismaDelivererRepository } from "@/infra/database/repositories/PrismaDelivererRepository.js";
import { PrismaPackageRepository } from "@/infra/database/repositories/PrismaPackageRepository.js";
import { PackageController } from "../http/controllers/PackageController.js";
import { DelivererController } from "../http/controllers/DelivererController.js";
import { AdminController } from "../http/controllers/AdminController.js";

export function makeControllers(prisma: PrismaClient){
    const packageRepository = new PrismaPackageRepository(prisma);
    const delivererRepository = new PrismaDelivererRepository(prisma);
    const adminRepository = new PrismaAdminRepository(prisma);

    const createPackageUseCase = new CreatePackageUseCase(packageRepository);
    const assignPackageToDelivererUseCase = new AssignPackageToDelivererUseCase(packageRepository, delivererRepository);
    const markPackageAsDeliveredUseCase = new MarkPackageAsDeliveredUseCase(packageRepository);
    const listPackagesByDelivererUseCase = new ListPackagesByDelivererUseCase(packageRepository);
    const getPackageDetailsUseCase = new GetPackageDetailsUseCase(packageRepository);

    const createDelivererUseCase = new CreateDelivererUseCase(delivererRepository);
    const listActiveDeliverers = new ListActiveDeliveresUseCase(delivererRepository);

    const createAdminUseCase = new CreateAdminUseCase(adminRepository);
    const authenticateAdminUseCase = new AuthenticateAdminUseCase(adminRepository);

    const packageController = new PackageController(
        createPackageUseCase,
        assignPackageToDelivererUseCase,
        markPackageAsDeliveredUseCase,
        listPackagesByDelivererUseCase,
        getPackageDetailsUseCase
    );

    const delivererController = new DelivererController(
        createDelivererUseCase,
        listActiveDeliverers
    );

    const adminController = new AdminController(
        createAdminUseCase,
        authenticateAdminUseCase
    );

    return {
        packageController,
        delivererController,
        adminController
    }
}