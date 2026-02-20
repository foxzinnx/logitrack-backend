import { AdminAlreadyExistsError, AdminNotActiveError, InvalidCredentialsError } from "@/domain/errors/AdminErrors.js";
import { DelivererAlreadyExistsError, DelivererNotActiveError } from "@/domain/errors/DelivererErrors.js";
import { DomainError } from "@/domain/errors/DomainError.js";
import { DeliveryPhotoRequiredError, PackageAlreadyAssignedError, PackageCannotBeAssignedError, PackageCannotBeDeliveredError, PackageNotAssignedError, PackageNotFoundError } from "@/domain/errors/PackageErrors.js";
import { InvalidCPFError, InvalidEmailError, InvalidUUIDError } from "@/domain/errors/ValueObjectsErrors.js";
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function ErrorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply){
    if(error instanceof DomainError){
        if(
            error instanceof InvalidCPFError ||
            error instanceof InvalidEmailError ||
            error instanceof InvalidUUIDError ||
            error instanceof DeliveryPhotoRequiredError ||
            error instanceof PackageCannotBeAssignedError ||
            error instanceof PackageCannotBeDeliveredError ||
            error instanceof PackageAlreadyAssignedError ||
            error instanceof PackageNotAssignedError
        ) {
            return reply.status(400).send({
                error: error.name,
                message: error.message
            });
        }

        if(error instanceof InvalidCredentialsError){
            return reply.status(401).send({
                error: error.name,
                message: error.message
            });
        }

        if(
            error instanceof DelivererNotActiveError ||
            error instanceof AdminNotActiveError ||
            error instanceof PackageNotFoundError
        ){
            return reply.status(404).send({
                error: error.name,
                message: error.message
            })
        }

        if(
            error instanceof DelivererAlreadyExistsError ||
            error instanceof AdminAlreadyExistsError
        ){
            return reply.status(409).send({
                error: error.name,
                message: error.message
            });
        }

        return reply.status(400).send({
            error: error.name,
            message: error.message
        })
    }

    if(error.validation){
        return reply.status(400).send({
            error: 'ValidationError',
            message: 'Invalid request data',
            details: error.validation
        });
    }

    console.error('Unhandled error:', error);

    return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
    });
}