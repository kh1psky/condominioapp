// src/pages/Manutencoes.tsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Edit3, CheckSquare } from 'lucide-react';
import api from '../services/api';
import ManutencaoModal from '../components/ManutencaoModal';
import { 
  Manutencao, 
  StatusManutencao, 
  PrioridadeManutencao,
  ConclusaoManutencaoPayload 
} from '../types/manutencao';

const Manutencoes: React.FC = () => {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedManutencao, setSelectedManutencao] = useState<Manutencao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadManutencoes();
  }, []);

  const loadManutencoes = async () => {
    try {
      const response = await api.get<Manutencao[]>('/manutencoes');
      setManutencoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
      setError('Não foi possível carregar as manutenções');
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

  const formatarValor = (valor?: number) => {
    if (!valor) return 'N/A';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getStatusColor = (status: StatusManutencao) => {
    switch (status) {
      case 'aberta':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade: PrioridadeManutencao) => {
    switch (prioridade) {
      case 'baixa':
        return 'bg-green-100 text-green-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'urgente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveManutencao = async () => {
    try {
      await loadManutencoes();
      setShowModal(false);
      setSelectedManutencao(null);
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
    }
  };

  const handleConcluirManutencao = async (id: number) => {
    if (!window.confirm('Deseja realmente concluir esta manutenção?')) {
      return;
    }

    try {
      const payload: ConclusaoManutencaoPayload = {
        custo: 0 // Você pode adicionar um modal para capturar o custo se desejar
      };

      await api.put(`/manutencoes/${id}/concluir`, payload);
      await loadManutencoes();
    } catch (error) {
      console.error('Erro ao concluir manutenção:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manutenções</h1>
        <button
          onClick={() => {
            setSelectedManutencao(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nova Manutenção
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título/Unidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Prevista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {manutencoes.map((manutencao) => (
                <tr key={manutencao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{manutencao.titulo}</div>
                    <div className="text-sm text-gray-500">
                      Unidade {manutencao.unidade.numero}
                      {manutencao.unidade.bloco && ` - Bloco ${manutencao.unidade.bloco}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize">{manutencao.tipo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(manutencao.status)}`}>
                      {manutencao.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPrioridadeColor(manutencao.prioridade)}`}>
                      {manutencao.prioridade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatarData(manutencao.dataPrevista)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {manutencao.responsavel?.nome || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatarValor(manutencao.custo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedManutencao(manutencao);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                    {manutencao.status !== 'concluida' && (
                      <button
                        onClick={() => handleConcluirManutencao(manutencao.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckSquare className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {manutencoes.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              Nenhuma manutenção encontrada
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ManutencaoModal
          manutencao={selectedManutencao}
          onClose={() => {
            setShowModal(false);
            setSelectedManutencao(null);
          }}
          onSave={handleSaveManutencao}
        />
      )}
    </div>
  );
};

export default Manutencoes;