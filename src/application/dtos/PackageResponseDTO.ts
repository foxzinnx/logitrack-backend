export interface PackageResponseDTO {
    id: string;
    recipientName: string;
    recipientPhone: string;
    address: {
        street: string;
        number: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    status: string;
    delivererId: string | null;
    deliveryPhotoUrl: string | null;
    deliveredAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}