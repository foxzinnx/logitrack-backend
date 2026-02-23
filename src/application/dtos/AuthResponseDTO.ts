export interface AuthResponseDTO{
    deliverer: {
        id: string;
        name: string;
        cpf: string;
        phone: string;
        status: string;
    },
    token: string;
}