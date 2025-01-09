import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';

interface Pagamento {
  id: number;
  valor: number;
  data_pagamento: string;
  metodo_pagamento: string;
  status: string;
  unidade: {
    id: number;
    numero: string;
    bloco?: string;
    condominio: {
      id: number;
      nome: string;
    };
  };
}

const Financeiro: React.FC = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth());
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear());

  useEffect(() => {
    carregarPagamentos();
  }, [filtroMes, filtroAno]);

  const carregarPagamentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pagamentos');
      setPagamentos(response.data || []); // Garante que seja array mesmo que vazio
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setError('Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    try {
      return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const calcularTotalMes = () => {
    return pagamentos
      .filter(pagamento => {
        const dataPagamento = new Date(pagamento.data_pagamento);
        return (
          dataPagamento.getMonth() === filtroMes &&
          dataPagamento.getFullYear() === filtroAno
        );
      })
      .reduce((total, pagamento) => total + Number(pagamento.valor), 0);
  };

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Financeiro</h1>

      <div className="mb-6 flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mês
          </label>
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(Number(e.target.value))}
            className="rounded-md border border-gray-300 p-2"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(2024, i, 1), 'MMMM', { locale: ptBR })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ano
          </label>
          <select
            value={filtroAno}
            onChange={(e) => setFiltroAno(Number(e.target.value))}
            className="rounded-md border border-gray-300 p-2"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={2024 + i}>
                {2024 + i}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Total do Mês</p>
          <p className="text-lg font-bold text-green-700">
            {formatarValor(calcularTotalMes())}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condomínio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagamentos
              .filter(pagamento => {
                const dataPagamento = new Date(pagamento.data_pagamento);
                return (
                  dataPagamento.getMonth() === filtroMes &&
                  dataPagamento.getFullYear() === filtroAno
                );
              })
              .map((pagamento) => (
                <tr key={pagamento.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatarData(pagamento.data_pagamento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pagamento.unidade.numero}
                    {pagamento.unidade.bloco && ` - Bloco ${pagamento.unidade.bloco}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pagamento.unidade?.condominio?.nome || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatarValor(pagamento.valor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pagamento.metodo_pagamento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pagamento.status === 'pago'
                          ? 'bg-green-100 text-green-800'
                          : pagamento.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pagamento.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {pagamentos.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Nenhum pagamento encontrado
          </div>
        )}
      </div>
    </div>
  );
};

export default Financeiro;