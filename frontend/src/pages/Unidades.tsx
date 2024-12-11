// src/pages/Unidades.tsx
import React, { useState, useEffect } from 'react';
import { Home, Edit, Trash2, Plus } from 'lucide-react';
import api from '../services/api';
import UnidadeModal from '../components/UnidadeModal';

interface Unidade {
  id: number;
  numero: string;
  condominioId: number;
  proprietario: string;
  contato: string;
  cpf: string;
  valorAluguel: number;
  dataVencimento: string;
  statusOcupacao: boolean;
  condominio?: {
    nome: string;
  };
}

const Unidades: React.FC = () => {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null);

  useEffect(() => {
    loadUnidades();
  }, []);

  const loadUnidades = async () => {
    try {
      const response = await api.get<Unidade[]>('/unidades');
      setUnidades(response.data);
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        await api.delete(`/unidades/${id}`);
        setUnidades(unidades.filter(u => u.id !== id));
      } catch (error) {
        console.error('Erro ao excluir unidade:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Unidades</h1>
        <button
          onClick={() => {
            setEditingUnidade(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Nova Unidade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unidades.map((unidade) => (
          <div key={unidade.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className={`bg-${unidade.statusOcupacao ? 'green' : 'gray'}-100 p-3 rounded-lg`}>
                  <Home className={`h-6 w-6 text-${unidade.statusOcupacao ? 'green' : 'gray'}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Unidade {unidade.numero}
                  </h3>
                  <p className="text-sm text-gray-500">{unidade.condominio?.nome}</p>
                  <p className="text-sm font-medium">
                    {unidade.statusOcupacao ? 'Ocupada' : 'Disponível'}
                  </p>
                  {unidade.proprietario && (
                    <p className="text-sm text-gray-600">
                      Proprietário: {unidade.proprietario}
                    </p>
                  )}
                  <p className="text-sm font-medium text-primary-600">
                    R$ {unidade.valorAluguel.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingUnidade(unidade);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(unidade.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showModal && (
        <UnidadeModal
          unidade={editingUnidade}
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            try {
              if (editingUnidade) {
                await api.put(`/unidades/${editingUnidade.id}`, data);
              } else {
                await api.post('/unidades', data);
              }
              loadUnidades();
              setShowModal(false);
            } catch (error) {
              console.error('Erro ao salvar unidade:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default Unidades;