// src/types/condominio.ts
// Define os tipos para melhor tipagem
export interface Condominio {
    id: number;
    nome: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    administradorId: number;
  }