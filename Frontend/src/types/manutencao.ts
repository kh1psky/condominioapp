// src/types/manutencao.ts

// Tipos de entidades
export interface Unidade {
  id: number;
  numero: string;
  bloco?: string;
  condominio?: {
    id: number;
    nome: string;
  };
  statusOcupacao?: boolean;
}

export interface Usuario {
  id: number;
  nome: string;
}

export interface Manutencao {
  id: number;
  titulo: string;
  tipo: TipoManutencao;
  descricao: string;
  status: StatusManutencao;
  prioridade: PrioridadeManutencao;
  unidadeId: number;
  unidade: Unidade;
  responsavel?: Usuario;
  dataAbertura: string;
  dataPrevista: string;
  dataConclusao?: string;
  custo?: number;
  observacoes?: string;
}

// Enums como tipos literais
export type TipoManutencao = 'preventiva' | 'corretiva' | 'emergencial';
export type StatusManutencao = 'aberta' | 'em_andamento' | 'concluida' | 'cancelada';
export type PrioridadeManutencao = 'baixa' | 'media' | 'alta' | 'urgente';

// Tipos para formulários e payloads
export interface ManutencaoFormData {
  titulo: string;
  tipo: TipoManutencao;
  descricao: string;
  prioridade: PrioridadeManutencao;
  unidadeId: string;
  dataPrevista: string;
  observacoes: string;
  custo?: string; // Novo campo
}

export interface ManutencaoPayload {
  titulo: string;
  tipo: TipoManutencao;
  descricao: string;
  prioridade: PrioridadeManutencao;
  unidadeId: number;
  dataPrevista: string;
  observacoes?: string;
}

export interface ConclusaoManutencaoPayload {
  custo?: number;
  observacoes?: string;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Tipos auxiliares
export interface ValidationErrors {
  [key: string]: string;
}