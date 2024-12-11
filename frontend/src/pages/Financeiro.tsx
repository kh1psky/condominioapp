// src/pages/Financeiro.tsx
import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Filter, Download } from 'lucide-react';
import api from '../services/api';

interface Pagamento {
  id: number;
  unidadeId: number;
  valor: number;
  dataVencimento: string;
  dataPagamento: string | null;
  status: 'pendente' | 'pago' | 'atrasado';
  unidade: {
    numero: string;
    condominio: {
      nome: string;
    }
  }
}

const Financeiro: React.FC = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    status: 'todos',
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear()
  });

  useEffect(() => {
    loadPagamentos();
  }, [filtro]);

  const loadPagamentos = async () => {
    try {
      const response = await api.get('/pagamentos', { params: filtro });
      setPagamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'atrasado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totais = {
    pago: pagamentos.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.valor, 0),
    pendente: pagamentos.filter(p => p.status === 'pendente').reduce((sum, p) => sum + p.valor, 0),
    atrasado: pagamentos.filter(p => p.status === 'atrasado').reduce((sum, p) => sum + p.valor, 0)
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
        <p className="text-gray-600">Gestão de pagamentos e receitas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Recebido</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totais.pago.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendente</p>
              <p className="text-2xl font-bold text-yellow-600">
                R$ {totais.pendente.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Em Atraso</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {totais.atrasado.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pagamentos</h2>
            <div className="flex gap-4">
              <select
                value={filtro.status}
                onChange={e => setFiltro({...filtro, status: e.target.value})}
                className="rounded-md border border-gray-300 p-2"
              >
                <option value="todos">Todos</option>
                <option value="pago">Pagos</option>
                <option value="pendente">Pendentes</option>
                <option value="atrasado">Atrasados</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                <Download className="h-4 w-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Unidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Condomínio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pagamento.unidade.numero}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pagamento.unidade.condominio.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {pagamento.valor.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(pagamento.dataVencimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pagamento.status)}`}>
                      {pagamento.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Financeiro;