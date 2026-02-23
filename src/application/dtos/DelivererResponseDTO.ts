export interface DelivererResponseDTO {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  status: string; // ✅ NOVO
  isActive: boolean;
  createdAt: Date;
}