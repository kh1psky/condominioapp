// src/components/ManutencaoModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
import { 
  Manutencao, 
  Unidade, 
  ManutencaoFormData, 
  ValidationErrors,
  TipoManutencao,
  PrioridadeManutencao 
} from '../types/manutencao';

interface ManutencaoModalProps {
  manutencao: Manutencao | null;
  onClose: () => void;
  onSave: () => void;
}

const initialFormData: ManutencaoFormData = {
  titulo: '',
  tipo: 'corretiva',
  descricao: '',
  prioridade: 'media',
  unidadeId: '',
  dataPrevista: format(new Date(), 'yyyy-MM-dd'),
  observacoes: '',
  custo: ''
};

const ManutencaoModal: React.FC<ManutencaoModalProps> = ({
  manutencao,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ManutencaoFormData>(initialFormData);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    loadUnidades();
    if (manutencao) {
      setFormData({
        titulo: manutencao.titulo,
        tipo: manutencao.tipo,
        descricao: manutencao.descricao,
        prioridade: manutencao.prioridade,
        unidadeId: String(manutencao.unidadeId),
        dataPrevista: manutencao.dataPrevista.split('T')[0],
        observacoes: manutencao.observacoes || '',
        custo: manutencao.custo?.toString() || ''
      });
    }
  }, [manutencao]);

  const loadUnidades = async () => {
    try {
      const response = await api.get<Unidade[]>('/unidades');
      const unidadesAtivas = response.data.filter(u => u.statusOcupacao);
      setUnidades(unidadesAtivas);
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
      setError('Erro ao carregar unidades. Por favor, tente novamente.');
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.titulo.trim()) {
      errors.titulo = 'O título é obrigatório';
    } else if (formData.titulo.length < 3) {
      errors.titulo = 'O título deve ter pelo menos 3 caracteres';
    }

    if (!formData.descricao.trim()) {
      errors.descricao = 'A descrição é obrigatória';
    } else if (formData.descricao.length < 10) {
      errors.descricao = 'A descrição deve ter pelo menos 10 caracteres';
    }

    if (!formData.unidadeId) {
      errors.unidadeId = 'Selecione uma unidade';
    }

    if (!formData.dataPrevista) {
      errors.dataPrevista = 'A data prevista é obrigatória';
    } else {
      const dataPrevista = new Date(formData.dataPrevista);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (dataPrevista < hoje) {
        errors.dataPrevista = 'A data prevista não pode ser anterior a hoje';
      }
    }

    if (formData.custo && Number(formData.custo) < 0) {
      errors.custo = 'O custo não pode ser negativo';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        unidadeId: parseInt(formData.unidadeId),
        custo: formData.custo ? Number(formData.custo) : null
      };

      if (manutencao) {
        await api.put(`/manutencoes/${manutencao.id}`, submitData);
      } else {
        await api.post('/manutencoes', submitData);
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar manutenção:', error);
      setError(error.response?.data?.message || 'Erro ao salvar manutenção. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {manutencao ? 'Editar' : 'Nova'} Manutenção
            </h2>
            <button 
              onClick={onClose}
              className="rounded p-2 hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={e => {
                  setFormData({...formData, titulo: e.target.value});
                  if (validationErrors.titulo) {
                    setValidationErrors({...validationErrors, titulo: ''});
                  }
                }}
                className={`mt-1 block w-full rounded-md border ${
                  validationErrors.titulo ? 'border-red-500' : 'border-gray-300'
                } p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                placeholder="Digite o título da manutenção"
              />
              {validationErrors.titulo && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.titulo}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700">Unidade</label>
              <select
                value={formData.unidadeId}
                onChange={e => {
                  setFormData({...formData, unidadeId: e.target.value});
                  if (validationErrors.unidadeId) {
                    setValidationErrors({...validationErrors, unidadeId: ''});
                  }
                }}
                className={`mt-1 block w-full rounded-md border ${
                  validationErrors.unidadeId ? 'border-red-500' : 'border-gray-300'
                } p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
              >
                <option value="">Selecione uma unidade</option>
                {unidades.map(unidade => (
                  <option key={unidade.id} value={unidade.id}>
                    Unidade {unidade.numero} - {unidade.condominio?.nome}
                  </option>
                ))}
              </select>
              {validationErrors.unidadeId && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.unidadeId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={e => setFormData({...formData, tipo: e.target.value as TipoManutencao})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="preventiva">Preventiva</option>
                  <option value="corretiva">Corretiva</option>
                  <option value="emergencial">Emergencial</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700">Prioridade</label>
                <select
                  value={formData.prioridade}
                  onChange={e => setFormData({...formData, prioridade: e.target.value as PrioridadeManutencao})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={e => {
                  setFormData({...formData, descricao: e.target.value});
                  if (validationErrors.descricao) {
                    setValidationErrors({...validationErrors, descricao: ''});
                  }
                }}
                rows={4}
                className={`mt-1 block w-full rounded-md border ${
                  validationErrors.descricao ? 'border-red-500' : 'border-gray-300'
                } p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                placeholder="Descreva detalhadamente a manutenção necessária"
              />
              {validationErrors.descricao && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.descricao}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Data Prevista</label>
                <input
                  type="date"
                  value={formData.dataPrevista}
                  onChange={e => {
                    setFormData({...formData, dataPrevista: e.target.value});
                    if (validationErrors.dataPrevista) {
                      setValidationErrors({...validationErrors, dataPrevista: ''});
                    }
                  }}
                  className={`mt-1 block w-full rounded-md border ${
                    validationErrors.dataPrevista ? 'border-red-500' : 'border-gray-300'
                  } p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
                {validationErrors.dataPrevista && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.dataPrevista}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700">Custo Estimado (R$)</label>
                <input
                  type="number"
                  value={formData.custo}
                  onChange={e => {
                    setFormData({...formData, custo: e.target.value});
                    if (validationErrors.custo) {
                      setValidationErrors({...validationErrors, custo: ''});
                    }
                  }}
                  className={`mt-1 block w-full rounded-md border ${
                    validationErrors.custo ? 'border-red-500' : 'border-gray-300'
                  } p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {validationErrors.custo && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.custo}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={e => setFormData({...formData, observacoes: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Observações adicionais (opcional)"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Salvando...' : manutencao ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManutencaoModal;