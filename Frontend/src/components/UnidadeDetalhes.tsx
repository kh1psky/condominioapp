// src/components/UnidadeDetalhes.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PagamentoModal from './PagamentoModal';

interface UnidadeDetalhes {
  id: number;
  numero: string;
  bloco?: string;
  proprietario: string;
  contato: string;
  cpf: string;
  valorAluguel: number;
  dataInicio: string;
  dataTermino: string;
  dataVencimento: string;
  statusOcupacao: boolean;
  condominio: {
    id: number;
    nome: string;
  };
  historicoPagamentos: Array<{
    id: number;
    valor: number;
    data_pagamento: string;
    status: string;
  }>;
  estatisticasPagamento: {
    totalPago: number;
    pagamentosEmDia: number;
    pagamentosAtrasados: number;
  };
  diasParaVencimento: number | null;
  observacao?: string;
}

interface Props {
  unidade: UnidadeDetalhes;
  onClose: () => void;
}

const UnidadeDetalhes: React.FC<Props> = ({ unidade, onClose }) => {
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);

  const formatarData = (dataString: string) => {
    if (!dataString) return '-';
    try {
      // Criar uma data local (sem timezone)
      const [ano, mes, dia] = dataString.split('-').map(Number);
      return format(new Date(ano, mes - 1, dia), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '-';
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handlePagamentoSalvo = async () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Detalhes da Unidade</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPagamentoModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Registrar Pagamento
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Informações Básicas</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Número:</span> {unidade.numero}</p>
              <p><span className="font-medium">Bloco:</span> {unidade.bloco || '-'}</p>
              <p><span className="font-medium">Condomínio:</span> {unidade.condominio.nome}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  unidade.statusOcupacao 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {unidade.statusOcupacao ? 'Ocupado' : 'Livre'}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Informações do Contrato</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Data de Início:</span> {formatarData(unidade.dataInicio)}
              </p>
              <p>
                <span className="font-medium">Data de Término:</span> {formatarData(unidade.dataTermino)}
              </p>
              <p>
                <span className="font-medium">Valor do Aluguel:</span> {formatarValor(unidade.valorAluguel)}
              </p>
              <p>
                <span className="font-medium">Vencimento:</span> {formatarData(unidade.dataVencimento)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Estatísticas de Pagamento</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Pago</p>
              <p className="text-lg font-bold">
                {formatarValor(unidade.estatisticasPagamento.totalPago)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Pagamentos em Dia</p>
              <p className="text-lg font-bold">
                {unidade.estatisticasPagamento.pagamentosEmDia}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Pagamentos Atrasados</p>
              <p className="text-lg font-bold">
                {unidade.estatisticasPagamento.pagamentosAtrasados}
              </p>
            </div>
          </div>
        </div>

        {unidade.diasParaVencimento !== null && (
          <div className={`mb-6 p-4 rounded-lg ${
            unidade.diasParaVencimento <= 30 ? 'bg-red-50 text-red-800' :
            unidade.diasParaVencimento <= 90 ? 'bg-yellow-50 text-yellow-800' :
            'bg-green-50 text-green-800'
          }`}>
            <p className="font-medium">
              {unidade.diasParaVencimento} dias para o término do contrato
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Informações do Proprietário</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Nome:</span> {unidade.proprietario}</p>
            <p><span className="font-medium">CPF:</span> {unidade.cpf}</p>
            <p><span className="font-medium">Contato:</span> {unidade.contato}</p>
          </div>
        </div>

        {unidade.observacao && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Observações</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{unidade.observacao}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Histórico de Pagamentos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {unidade.historicoPagamentos.length > 0 ? (
                  unidade.historicoPagamentos.map((pagamento) => (
                    <tr key={pagamento.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatarData(pagamento.data_pagamento)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatarValor(pagamento.valor)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pagamento.status === 'pago' 
                            ? 'bg-green-100 text-green-800' 
                            : pagamento.status === 'pendente' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {pagamento.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                      Nenhum pagamento registrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showPagamentoModal && (
          <PagamentoModal
            unidade={{
              id: unidade.id,
              numero: unidade.numero,
              valorAluguel: unidade.valorAluguel,
              statusOcupacao: unidade.statusOcupacao,
              dataVencimento: unidade.dataVencimento
            }}
            onClose={() => setShowPagamentoModal(false)}
            onSave={handlePagamentoSalvo}
          />
        )}
      </div>
    </div>
  );
};

export default UnidadeDetalhes;