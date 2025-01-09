// src/pages/Relatorios.tsx
import React, { useState } from 'react';
import { FileText, Download, Filter, PieChart } from 'lucide-react';
import api from '../services/api';

type Periodo = 'mes_atual' | 'mes_anterior' | 'ultimos_3_meses' | 'ultimos_6_meses' | 'ano_atual';

interface FiltrosRelatorio {
  periodo: Periodo;
  condominioId?: number;
  tipoRelatorio: 'financeiro' | 'ocupacao' | 'manutencao';
}

const Relatorios: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    periodo: 'mes_atual',
    tipoRelatorio: 'financeiro'
  });

  const gerarRelatorio = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/relatorios/${filtros.tipoRelatorio}`, {
        params: filtros,
        responseType: 'blob'
      });

      // Criar blob e fazer download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_${filtros.tipoRelatorio}_${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Geração de relatórios e análises</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer border-2 transition-colors
            ${filtros.tipoRelatorio === 'financeiro' ? 'border-primary-600' : 'border-transparent hover:border-gray-200'}`}
          onClick={() => setFiltros({...filtros, tipoRelatorio: 'financeiro'})}
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Relatório Financeiro</h3>
              <p className="text-sm text-gray-500">Receitas, despesas e inadimplência</p>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer border-2 transition-colors
            ${filtros.tipoRelatorio === 'ocupacao' ? 'border-primary-600' : 'border-transparent hover:border-gray-200'}`}
          onClick={() => setFiltros({...filtros, tipoRelatorio: 'ocupacao'})}
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Relatório de Ocupação</h3>
              <p className="text-sm text-gray-500">Taxa de ocupação e rotatividade</p>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer border-2 transition-colors
            ${filtros.tipoRelatorio === 'manutencao' ? 'border-primary-600' : 'border-transparent hover:border-gray-200'}`}
          onClick={() => setFiltros({...filtros, tipoRelatorio: 'manutencao'})}
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Filter className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Relatório de Manutenções</h3>
              <p className="text-sm text-gray-500">Histórico e custos de manutenções</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros do Relatório</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Período</label>
            <select
              value={filtros.periodo}
              onChange={(e) => setFiltros({...filtros, periodo: e.target.value as Periodo})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            >
              <option value="mes_atual">Mês Atual</option>
              <option value="mes_anterior">Mês Anterior</option>
              <option value="ultimos_3_meses">Últimos 3 Meses</option>
              <option value="ultimos_6_meses">Últimos 6 Meses</option>
              <option value="ano_atual">Ano Atual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Condomínio (Opcional)</label>
            <select
              value={filtros.condominioId || ''}
              onChange={(e) => setFiltros({...filtros, condominioId: e.target.value ? parseInt(e.target.value) : undefined})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">Todos os Condomínios</option>
              {/* Adicionar options dos condomínios depois */}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={gerarRelatorio}
            disabled={loading}
            className={`flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Gerando...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Gerar Relatório
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;