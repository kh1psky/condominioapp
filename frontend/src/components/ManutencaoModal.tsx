// src/components/ManutencaoModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';
import { Manutencao } from '../models/Manutencao';

interface ManutencaoModalProps {
 manutencao: Manutencao | null;
 onClose: () => void;
 onSave: (data: any) => void;
}

interface Unidade {
 id: number;
 numero: string;
 condominio: {
   nome: string;
 };
}

const ManutencaoModal: React.FC<ManutencaoModalProps> = ({
 manutencao,
 onClose,
 onSave
}) => {
 const [unidades, setUnidades] = useState<Unidade[]>([]);
 const [formData, setFormData] = useState({
   unidadeId: '',
   tipo: 'corretiva',
   titulo: '',
   descricao: '',
   dataPrevista: '',
   status: 'aberta',
   prioridade: 'media',
   responsavel: '',
   observacoes: ''
 });

 useEffect(() => {
   loadUnidades();
   if (manutencao) {
     setFormData({
       unidadeId: manutencao.unidadeId.toString(),
       tipo: manutencao.tipo,
       titulo: manutencao.titulo,
       descricao: manutencao.descricao,
       dataPrevista: manutencao.dataPrevista,
       status: manutencao.status,
       prioridade: manutencao.prioridade,
       responsavel: manutencao.responsavel || '',
       observacoes: manutencao.observacoes || ''
     });
   }
 }, [manutencao]);

 const loadUnidades = async () => {
   try {
     const response = await api.get<Unidade[]>('/unidades');
     setUnidades(response.data);
   } catch (error) {
     console.error('Erro ao carregar unidades:', error);
   }
 };

 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   onSave({
     ...formData,
     unidadeId: parseInt(formData.unidadeId)
   });
 };

 return (
   <div className="fixed inset-0 z-50 overflow-y-auto">
     <div className="flex min-h-screen items-center justify-center px-4">
       <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
       
       <div className="relative w-full max-w-2xl rounded-lg bg-white p-6">
         <div className="mb-4 flex items-center justify-between">
           <h2 className="text-xl font-bold text-gray-900">
             {manutencao ? 'Editar' : 'Nova'} Manutenção
           </h2>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             <X className="h-6 w-6" />
           </button>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700">Unidade</label>
               <select
                 value={formData.unidadeId}
                 onChange={e => setFormData({...formData, unidadeId: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
               >
                 <option value="">Selecione...</option>
                 {unidades.map(unidade => (
                   <option key={unidade.id} value={unidade.id}>
                     {unidade.numero} - {unidade.condominio.nome}
                   </option>
                 ))}
               </select>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">Tipo</label>
               <select
                 value={formData.tipo}
                 onChange={e => setFormData({...formData, tipo: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
               >
                 <option value="preventiva">Preventiva</option>
                 <option value="corretiva">Corretiva</option>
                 <option value="emergencial">Emergencial</option>
               </select>
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700">Título</label>
             <input
               type="text"
               value={formData.titulo}
               onChange={e => setFormData({...formData, titulo: e.target.value})}
               className="mt-1 block w-full rounded-md border border-gray-300 p-2"
               required
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700">Descrição</label>
             <textarea
               value={formData.descricao}
               onChange={e => setFormData({...formData, descricao: e.target.value})}
               className="mt-1 block w-full rounded-md border border-gray-300 p-2"
               rows={3}
               required
             />
           </div>

           <div className="grid grid-cols-3 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700">Data Prevista</label>
               <input
                 type="date"
                 value={formData.dataPrevista}
                 onChange={e => setFormData({...formData, dataPrevista: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">Prioridade</label>
               <select
                 value={formData.prioridade}
                 onChange={e => setFormData({...formData, prioridade: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
               >
                 <option value="baixa">Baixa</option>
                 <option value="media">Média</option>
                 <option value="alta">Alta</option>
               </select>
             </div>

             {manutencao && (
               <div>
                 <label className="block text-sm font-medium text-gray-700">Status</label>
                 <select
                   value={formData.status}
                   onChange={e => setFormData({...formData, status: e.target.value})}
                   className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 >
                   <option value="aberta">Aberta</option>
                   <option value="em_andamento">Em Andamento</option>
                   <option value="concluida">Concluída</option>
                   <option value="cancelada">Cancelada</option>
                 </select>
               </div>
             )}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700">Responsável</label>
             <input
               type="text"
               value={formData.responsavel}
               onChange={e => setFormData({...formData, responsavel: e.target.value})}
               className="mt-1 block w-full rounded-md border border-gray-300 p-2"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700">Observações</label>
             <textarea
               value={formData.observacoes}
               onChange={e => setFormData({...formData, observacoes: e.target.value})}
               className="mt-1 block w-full rounded-md border border-gray-300 p-2"
               rows={2}
             />
           </div>

           <div className="mt-6 flex justify-end gap-3">
             <button
               type="button"
               onClick={onClose}
               className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
             >
               Cancelar
             </button>
             <button
               type="submit"
               className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
             >
               {manutencao ? 'Salvar' : 'Criar'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
};

export default ManutencaoModal;