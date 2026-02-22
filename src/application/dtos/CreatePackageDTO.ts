export interface CreatePackageDTO {
    recipientName: string;
    recipientPhone: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}