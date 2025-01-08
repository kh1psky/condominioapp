// src/models/Manutencao.ts
export interface Manutencao {
    id: number;
    unidadeId: number;
    tipo: 'preventiva' | 'corretiva' | 'emergencial';
    titulo: string;
    descricao: string;
    dataAbertura: string;
    dataPrevista: string;
    dataConclusao: string | null;
    status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada';
    prioridade: 'baixa' | 'media' | 'alta';
    custo: number | null;
    responsavel: string | null;
    observacoes: string | null;
    unidade: {
      numero: string;
      condominio: {
        nome: string;
      }
    }
}
  
export interface ManutencaoPayload {
    unidadeId: number;
    tipo: 'preventiva' | 'corretiva' | 'emergencial';
    titulo: string;
    descricao: string;
    dataPrevista: string;
    prioridade: 'baixa' | 'media' | 'alta';
    responsavel?: string;
    observacoes?: string;
}