// src/pages/Manutencoes.tsx
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Clock } from 'lucide-react';
import api from '../services/api';
import { Manutencao, ManutencaoPayload } from '../models/Manutencao';
import ManutencaoModal from '../components/ManutencaoModal';

const Manutencoes: React.FC = () => {
 const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
 const [loading, setLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [editingManutencao, setEditingManutencao] = useState<Manutencao | null>(null);

 useEffect(() => {
   loadManutencoes();
 }, []);

 const loadManutencoes = async () => {
   try {
     const response = await api.get<Manutencao[]>('/manutencoes');
     setManutencoes(response.data);
   } catch (error) {
     console.error('Erro ao carregar manutenções:', error);
   } finally {
     setLoading(false);
   }
 };

 const getPrioridadeStyle = (prioridade: string) => {
   switch (prioridade) {
     case 'alta': return 'bg-red-100 text-red-800';
     case 'media': return 'bg-yellow-100 text-yellow-800';
     case 'baixa': return 'bg-green-100 text-green-800';
     default: return 'bg-gray-100 text-gray-800';
   }
 };

 const getStatusStyle = (status: string) => {
   switch (status) {
     case 'concluida': return 'bg-green-100 text-green-800';
     case 'em_andamento': return 'bg-blue-100 text-blue-800';
     case 'aberta': return 'bg-yellow-100 text-yellow-800';
     case 'cancelada': return 'bg-red-100 text-red-800';
     default: return 'bg-gray-100 text-gray-800';
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
       <div>
         <h1 className="text-2xl font-bold text-gray-900">Manutenções</h1>
         <p className="text-gray-600">Gestão de manutenções e reparos</p>
       </div>
       <button
         onClick={() => {
           setEditingManutencao(null);
           setShowModal(true);
         }}
         className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
       >
         <Plus className="h-5 w-5" />
         Nova Manutenção
       </button>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
       <div className="bg-white rounded-lg shadow-sm p-6">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-500">Em Andamento</p>
             <p className="text-2xl font-bold text-blue-600">
               {manutencoes.filter(m => m.status === 'em_andamento').length}
             </p>
           </div>
           <div className="bg-blue-100 p-3 rounded-lg">
             <Wrench className="h-6 w-6 text-blue-600" />
           </div>
         </div>
       </div>

       <div className="bg-white rounded-lg shadow-sm p-6">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-500">Pendentes</p>
             <p className="text-2xl font-bold text-yellow-600">
               {manutencoes.filter(m => m.status === 'aberta').length}
             </p>
           </div>
           <div className="bg-yellow-100 p-3 rounded-lg">
             <Clock className="h-6 w-6 text-yellow-600" />
           </div>
         </div>
       </div>

       <div className="bg-white rounded-lg shadow-sm p-6">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-500">Concluídas</p>
             <p className="text-2xl font-bold text-green-600">
               {manutencoes.filter(m => m.status === 'concluida').length}
             </p>
           </div>
           <div className="bg-green-100 p-3 rounded-lg">
             <Wrench className="h-6 w-6 text-green-600" />
           </div>
         </div>
       </div>
     </div>

     <div className="bg-white rounded-lg shadow-sm">
       <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-gray-50">
           <tr>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
               Título
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
               Unidade
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
               Tipo
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
               Data Prevista
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
               Prioridade
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
               Status
             </th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
           {manutencoes.map((manutencao) => (
             <tr 
               key={manutencao.id}
               className="hover:bg-gray-50 cursor-pointer"
               onClick={() => {
                 setEditingManutencao(manutencao);
                 setShowModal(true);
               }}
             >
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm font-medium text-gray-900">
                   {manutencao.titulo}
                 </div>
                 <div className="text-sm text-gray-500">
                   {manutencao.tipo}
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm text-gray-900">
                   {manutencao.unidade.numero}
                 </div>
                 <div className="text-sm text-gray-500">
                   {manutencao.unidade.condominio.nome}
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                 {manutencao.tipo}
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                 {new Date(manutencao.dataPrevista).toLocaleDateString('pt-BR')}
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrioridadeStyle(manutencao.prioridade)}`}>
                   {manutencao.prioridade}
                 </span>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(manutencao.status)}`}>
                   {manutencao.status.replace('_', ' ')}
                 </span>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     {showModal && (
       <ManutencaoModal
         manutencao={editingManutencao}
         onClose={() => setShowModal(false)}
         onSave={async (data: ManutencaoPayload) => {
           try {
             if (editingManutencao) {
               await api.put(`/manutencoes/${editingManutencao.id}`, data);
             } else {
               await api.post('/manutencoes', data);
             }
             loadManutencoes();
             setShowModal(false);
           } catch (error) {
             console.error('Erro ao salvar manutenção:', error);
           }
         }}
       />
     )}
   </div>
 );
};

export default Manutencoes;