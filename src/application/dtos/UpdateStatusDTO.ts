export interface UpdateStatusDTO {
    delivererId: string;
    status: 'ONLINE' | 'OFFLINE' | 'BUSY'
}