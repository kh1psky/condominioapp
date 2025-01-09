// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
 Home, Users, DollarSign, AlertTriangle, 
 Building, Wrench, CheckCircle 
} from 'lucide-react';
import { 
 LineChart, Line, XAxis, YAxis, CartesianGrid, 
 Tooltip, ResponsiveContainer 
} from 'recharts';
import api from '../services/api';

interface DashboardMetrics {
 total: {
   condominios: number;
   unidades: number;
   unidadesOcupadas: number;
 };
 financeiro: {
   receitaMes: number;
   pagamentosPendentes: number;
 };
}

interface Pendencia {
 id: number;
 valor: number;
 dataVencimento: string;
 status: string;
 unidade: string;
 observacao?: string;
}

interface GraficoData {
 mes: string;
 total: number;
}

interface DashboardCard {
 title: string;
 value: string | number;
 icon: React.ElementType;
 color: string;
}

const Dashboard: React.FC = () => {
 const [metrics, setMetrics] = useState<DashboardMetrics>({
   total: {
     condominios: 0,
     unidades: 0,
     unidadesOcupadas: 0
   },
   financeiro: {
     receitaMes: 0,
     pagamentosPendentes: 0
   }
 });
 const [pendencias, setPendencias] = useState<Pendencia[]>([]);
 const [graficoData, setGraficoData] = useState<GraficoData[]>([]);
 const [loading, setLoading] = useState(true);

 const cards: DashboardCard[] = [
   {
     title: 'Total de Condomínios',
     value: metrics.total.condominios,
     icon: Building,
     color: 'bg-blue-500'
   },
   {
     title: 'Unidades',
     value: metrics.total.unidades,
     icon: Home,
     color: 'bg-green-500'
   },
   {
     title: 'Taxa de Ocupação',
     value: `${((metrics.total.unidadesOcupadas / metrics.total.unidades || 0) * 100).toFixed(1)}%`,
     icon: Users,
     color: 'bg-purple-500'
   },
   {
     title: 'Receita Mensal',
     value: `R$ ${metrics.financeiro.receitaMes?.toLocaleString('pt-BR', {
       minimumFractionDigits: 2,
       maximumFractionDigits: 2
     }) || '0,00'}`,
     icon: DollarSign,
     color: 'bg-yellow-500'
   },
   {
     title: 'Pagamentos Pendentes',
     value: metrics.financeiro.pagamentosPendentes || 0,
     icon: AlertTriangle,
     color: 'bg-red-500'
   }
 ];

 useEffect(() => {
   const loadDashboardData = async () => {
     try {
       const [metricsResponse, pendenciasResponse, graficoResponse] = await Promise.all([
         api.get('/dashboard/metricas'),
         api.get('/dashboard/pendencias'),
         api.get('/dashboard/grafico-financeiro')
       ]);

       setMetrics(metricsResponse.data);
       setPendencias(pendenciasResponse.data.pendencias || []);
       setGraficoData(graficoResponse.data);
     } catch (error) {
       console.error('Erro ao carregar dados do dashboard:', error);
     } finally {
       setLoading(false);
     }
   };

   loadDashboardData();
 }, []);

 const formatarData = (data: string) => {
   return new Date(data).toLocaleDateString('pt-BR');
 };

 const formatarValor = (valor: number) => {
   return valor.toLocaleString('pt-BR', {
     style: 'currency',
     currency: 'BRL'
   });
 };

 if (loading) {
   return (
     <div className="flex items-center justify-center h-full">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
     </div>
   );
 }

 return (
   <div className="p-6 space-y-6">
     {/* Seção de Cards */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {cards.map((card, index) => (
         <div
           key={index}
           className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:scale-105"
         >
           <div className="flex items-center justify-between">
             <div className="flex flex-col">
               <span className="text-sm text-gray-500">{card.title}</span>
               <span className="text-2xl font-bold mt-2">{card.value}</span>
             </div>
             <div className={`${card.color} p-3 rounded-lg`}>
               <card.icon className="h-6 w-6 text-white" />
             </div>
           </div>
         </div>
       ))}
     </div>

     {/* Grid com Gráfico e Pendências */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Gráfico Financeiro */}
       <div className="bg-white p-6 rounded-lg shadow-sm">
         <h2 className="text-lg font-semibold mb-4">Resumo Financeiro</h2>
         <div className="h-80">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={graficoData}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="mes" />
               <YAxis />
               <Tooltip formatter={(value) => formatarValor(Number(value))} />
               <Line 
                 type="monotone" 
                 dataKey="total" 
                 stroke="#10B981" 
                 name="Total"
               />
             </LineChart>
           </ResponsiveContainer>
         </div>
       </div>

       {/* Lista de Pendências */}
       <div className="bg-white p-6 rounded-lg shadow-sm">
         <h2 className="text-lg font-semibold mb-4">Pagamentos Pendentes</h2>
         <div className="space-y-4">
           {pendencias.map((pendencia) => (
             <div 
               key={pendencia.id} 
               className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
             >
               <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0">
                   <AlertTriangle className="h-5 w-5 text-gray-500" />
                 </div>
                 <div>
                   <p className="font-medium">Unidade {pendencia.unidade}</p>
                   <p className="text-sm text-gray-500">
                     Vencimento: {formatarData(pendencia.dataVencimento)}
                   </p>
                   <p className="text-sm font-semibold text-gray-700">
                     {formatarValor(pendencia.valor)}
                   </p>
                 </div>
               </div>
               <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                 {pendencia.status}
               </span>
             </div>
           ))}
           
           {pendencias.length === 0 && (
             <div className="text-center py-8 text-gray-500">
               <CheckCircle className="h-12 w-12 mx-auto mb-2" />
               <p>Nenhuma pendência encontrada</p>
             </div>
           )}
         </div>
       </div>
     </div>
   </div>
 );
};

export default Dashboard;