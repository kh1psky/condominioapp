// src/components/PagamentoModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

interface PagamentoModalProps {
  unidade: {
    id: number;
    numero: string;
    valorAluguel: number;
    statusOcupacao: boolean;
    dataVencimento: string;
  };
  onClose: () => void;
  onSave: () => void;
}

interface PagamentoFormData {
  unidadeId: number;
  valor_total: number;
  valor_dinheiro: number;
  valor_pix: number;
  metodo_pagamento: 'dinheiro' | 'pix' | 'misto';
  observacao?: string;
}

const PagamentoModal: React.FC<PagamentoModalProps> = ({
  unidade,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<PagamentoFormData>({
    unidadeId: unidade.id,
    valor_total: unidade.valorAluguel,
    valor_dinheiro: unidade.valorAluguel,
    valor_pix: 0,
    metodo_pagamento: 'dinheiro',
    observacao: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Renderiza o modal de erro para unidade desocupada
  if (!unidade.statusOcupacao) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
          <div className="relative w-full max-w-md rounded-lg bg-white p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Não é possível registrar pagamento
              </h2>
              <p className="text-gray-600 mb-4">
                Esta unidade está desocupada. Não é possível registrar pagamentos.
              </p>
              <button
                onClick={onClose}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const atualizarValores = (metodo: 'dinheiro' | 'pix' | 'misto') => {
    let valor_dinheiro = 0;
    let valor_pix = 0;

    switch (metodo) {
      case 'dinheiro':
        valor_dinheiro = unidade.valorAluguel;
        break;
      case 'pix':
        valor_pix = unidade.valorAluguel;
        break;
      case 'misto':
        valor_dinheiro = formData.valor_dinheiro;
        valor_pix = formData.valor_pix;
        break;
    }

    setFormData(prev => ({
      ...prev,
      metodo_pagamento: metodo,
      valor_dinheiro,
      valor_pix
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dadosPagamento = {
        unidadeId: unidade.id,
        valor_total: unidade.valorAluguel,
        valor_dinheiro: formData.valor_dinheiro,
        valor_pix: formData.valor_pix,
        metodo_pagamento: formData.metodo_pagamento,
        observacao: formData.observacao || ''
      };

      const total = Number(dadosPagamento.valor_dinheiro) + Number(dadosPagamento.valor_pix);
      
      if (Math.abs(total - unidade.valorAluguel) > 0.01) {
        throw new Error(`O valor total deve ser exatamente R$ ${unidade.valorAluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      }

      await api.post('/pagamentos', dadosPagamento);
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      setError(error.response?.data?.error || error.message || 'Erro ao registrar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleValorChange = (tipo: 'dinheiro' | 'pix', valor: string) => {
    const numeroLimpo = valor.replace(/^0+/, '') || '0';
    const novoValor = Math.max(0, Number(numeroLimpo));

    if (formData.metodo_pagamento === 'misto') {
      if (tipo === 'dinheiro') {
        setFormData(prev => ({
          ...prev,
          valor_dinheiro: novoValor,
          valor_pix: Math.max(0, unidade.valorAluguel - novoValor)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          valor_pix: novoValor,
          valor_dinheiro: Math.max(0, unidade.valorAluguel - novoValor)
        }));
      }
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative w-full max-w-md rounded-lg bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Registrar Pagamento - Unidade {unidade.numero}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-lg font-medium">
              Valor Total: {formatarValor(unidade.valorAluguel)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Método de Pagamento
              </label>
              <select
                value={formData.metodo_pagamento}
                onChange={e => atualizarValores(e.target.value as 'dinheiro' | 'pix' | 'misto')}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="misto">Misto (Dinheiro + PIX)</option>
              </select>
            </div>

            {formData.metodo_pagamento === 'misto' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor em Dinheiro
                  </label>
                  <input
                    type="text"
                    value={formData.valor_dinheiro}
                    onChange={e => handleValorChange('dinheiro', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor em PIX
                  </label>
                  <input
                    type="text"
                    value={formData.valor_pix}
                    onChange={e => handleValorChange('pix', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                </div>

                <div className="text-sm text-gray-500">
                  Total: {formatarValor(formData.valor_dinheiro + formData.valor_pix)}
                </div>
              </>
            )}

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
                {loading ? 'Registrando...' : 'Registrar Pagamento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PagamentoModal;