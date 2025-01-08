// src/components/UnidadeModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

interface UnidadeFormData {
  numero: string;
  condominioId: number;
  proprietario: string;
  contato: string;
  cpf: string;
  valorAluguel: number;
  dataVencimento: string;
  dataInicio: string;
  dataTermino: string;
  statusOcupacao: boolean;
  bloco?: string;
  observacao?: string;
}

interface Condominio {
  id: number;
  nome: string;
}

interface UnidadeModalProps {
  unidade: {
    id: number;
    numero: string;
    condominioId: number;
    proprietario: string;
    contato: string;
    cpf: string;
    valorAluguel: number;
    dataVencimento: string;
    dataInicio: string;
    dataTermino: string;
    statusOcupacao: boolean;
    bloco?: string;
    observacao?: string;
  } | null;
  onClose: () => void;
  onSave: (data: UnidadeFormData) => Promise<void>;
}

const UnidadeModal: React.FC<UnidadeModalProps> = ({
  unidade,
  onClose,
  onSave
}) => {
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [formData, setFormData] = useState<UnidadeFormData>({
    numero: '',
    condominioId: 0,
    proprietario: '',
    contato: '',
    cpf: '',
    valorAluguel: 0,
    dataVencimento: '',
    dataInicio: '',
    dataTermino: '',
    statusOcupacao: false,
    bloco: '',
    observacao: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCondominios();
    if (unidade) {
      setFormData({
        numero: unidade.numero,
        condominioId: unidade.condominioId,
        proprietario: unidade.proprietario,
        contato: unidade.contato,
        cpf: unidade.cpf,
        valorAluguel: unidade.valorAluguel,
        dataVencimento: unidade.dataVencimento,
        dataInicio: unidade.dataInicio,
        dataTermino: unidade.dataTermino,
        statusOcupacao: unidade.statusOcupacao,
        bloco: unidade.bloco || '',
        observacao: unidade.observacao || ''
      });
    }
  }, [unidade]);

  const loadCondominios = async () => {
    try {
      const response = await api.get<Condominio[]>('/condominios');
      setCondominios(response.data);
    } catch (error) {
      console.error('Erro ao carregar condomínios:', error);
      setError('Erro ao carregar condomínios');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao salvar unidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {unidade ? 'Editar' : 'Nova'} Unidade
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={e => setFormData({...formData, numero: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bloco
                </label>
                <input
                  type="text"
                  value={formData.bloco}
                  onChange={e => setFormData({...formData, bloco: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condomínio
              </label>
              <select
                value={formData.condominioId}
                onChange={e => setFormData({...formData, condominioId: Number(e.target.value)})}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              >
                <option value="">Selecione...</option>
                {condominios.map(cond => (
                  <option key={cond.id} value={cond.id}>{cond.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proprietário
              </label>
              <input
                type="text"
                value={formData.proprietario}
                onChange={e => setFormData({...formData, proprietario: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contato
                </label>
                <input
                  type="text"
                  value={formData.contato}
                  onChange={e => setFormData({...formData, contato: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={e => setFormData({...formData, cpf: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  maxLength={11}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor do Aluguel
                </label>
                <input
                  type="number"
                  value={formData.valorAluguel}
                  onChange={e => setFormData({...formData, valorAluguel: Number(e.target.value)})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={formData.dataVencimento}
                  onChange={e => setFormData({...formData, dataVencimento: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={e => setFormData({...formData, dataInicio: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Término
                </label>
                <input
                  type="date"
                  value={formData.dataTermino}
                  onChange={e => setFormData({...formData, dataTermino: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observação
              </label>
              <textarea
                value={formData.observacao}
                onChange={e => setFormData({...formData, observacao: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                rows={3}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.statusOcupacao}
                onChange={e => setFormData({...formData, statusOcupacao: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Unidade ocupada
              </label>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                disabled={loading}
              >
                {loading ? 'Salvando...' : unidade ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnidadeModal;