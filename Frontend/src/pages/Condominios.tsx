// src/pages/Condominios.tsx
import React, { useEffect, useState } from 'react';
import { Building2, Edit, Trash2, Plus } from 'lucide-react';
import api from '../services/api';
import CondominioModal from '../components/CondominioModal';

interface Condominio {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  administradorId: number;
}

const Condominios: React.FC = () => {
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCondominio, setEditingCondominio] = useState<Condominio | null>(null);

  useEffect(() => {
    loadCondominios();
  }, []);

  const loadCondominios = async () => {
    try {
      const response = await api.get('/condominios');
      setCondominios(response.data);
    } catch (error) {
      console.error('Erro ao carregar condomínios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este condomínio?')) {
      try {
        await api.delete(`/condominios/${id}`);
        setCondominios(condominios.filter(c => c.id !== id));
      } catch (error) {
        console.error('Erro ao excluir condomínio:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Condomínios</h1>
        <button
          onClick={() => {
            setEditingCondominio(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Novo Condomínio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {condominios.map((condominio) => (
          <div key={condominio.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{condominio.nome}</h3>
                  <p className="text-sm text-gray-500">{condominio.endereco}</p>
                  <p className="text-sm text-gray-500">
                    {condominio.cidade} - {condominio.estado}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCondominio(condominio);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(condominio.id)}
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
        <CondominioModal
          condominio={editingCondominio}
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            try {
              if (editingCondominio) {
                await api.put(`/condominios/${editingCondominio.id}`, data);
              } else {
                await api.post('/condominios', data);
              }
              loadCondominios();
              setShowModal(false);
            } catch (error) {
              console.error('Erro ao salvar condomínio:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default Condominios;