// src/components/UnidadeModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

interface Condominio {
 id: number;
 nome: string;
}

interface UnidadeFormData {
 numero: string;
 condominioId: number; 
 proprietario: string;
 contato: string;
 cpf: string;
 valorAluguel: string;
 dataVencimento: string;
 statusOcupacao: boolean;
}

interface UnidadeModalProps {
 unidade?: {
   id: number;
   numero: string;
   condominioId: number;
   proprietario: string;
   contato: string;
   cpf: string;
   valorAluguel: number;
   dataVencimento: string;
   statusOcupacao: boolean;
 } | null;
 onClose: () => void;
 onSave: (data: any) => void; 
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
   valorAluguel: '',
   dataVencimento: '',
   statusOcupacao: false
 });

 useEffect(() => {
   if (unidade) {
     setFormData({
       ...unidade,
       valorAluguel: unidade.valorAluguel.toString(),
       condominioId: unidade.condominioId
     });
   }
   loadCondominios();
 }, [unidade]);

 const loadCondominios = async () => {
   try {
     const response = await api.get<Condominio[]>('/condominios');
     setCondominios(response.data);
   } catch (error) {
     console.error('Erro ao carregar condomínios:', error);
   }
 };

 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   onSave({
     ...formData,
     valorAluguel: parseFloat(formData.valorAluguel)
   });
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
               <label className="block text-sm font-medium text-gray-700">Número</label>
               <input
                 type="text"
                 value={formData.numero}
                 onChange={e => setFormData({...formData, numero: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">Condomínio</label>
               <select
                 value={formData.condominioId}
                 onChange={e => setFormData({...formData, condominioId: parseInt(e.target.value)})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
               >
                 <option value="">Selecione...</option>
                 {condominios.map(cond => (
                   <option key={cond.id} value={cond.id}>{cond.nome}</option>
                 ))}
               </select>
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700">Proprietário</label>
             <input
               type="text"
               value={formData.proprietario}
               onChange={e => setFormData({...formData, proprietario: e.target.value})}
               className="mt-1 block w-full rounded-md border border-gray-300 p-2"
             />
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700">Contato</label>
               <input
                 type="text"
                 value={formData.contato}
                 onChange={e => setFormData({...formData, contato: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">CPF</label>
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
               <label className="block text-sm font-medium text-gray-700">Valor do Aluguel</label>
               <input
                 type="number"
                 value={formData.valorAluguel}
                 onChange={e => setFormData({...formData, valorAluguel: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
                 min="0"
                 step="0.01"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">Vencimento</label>
               <input
                 type="date"
                 value={formData.dataVencimento}
                 onChange={e => setFormData({...formData, dataVencimento: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
               />
             </div>
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
               {unidade ? 'Salvar' : 'Criar'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
};

export default UnidadeModal;