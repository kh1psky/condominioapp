// src/components/CondominioModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CondominioModalProps {
 condominio?: {
   id: number;
   nome: string;
   endereco: string;
   cidade: string;
   estado: string;
   cep: string;
 } | null;
 onClose: () => void;
 onSave: (data: any) => void;
}

const CondominioModal: React.FC<CondominioModalProps> = ({
 condominio,
 onClose,
 onSave
}) => {
 const [formData, setFormData] = useState({
   nome: '',
   endereco: '',
   cidade: '',
   estado: '',
   cep: ''
 });

 useEffect(() => {
   if (condominio) {
     setFormData(condominio);
   }
 }, [condominio]);

 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   onSave(formData);
 };

 return (
   <div className="fixed inset-0 z-50 overflow-y-auto">
     <div className="flex min-h-screen items-center justify-center px-4">
       <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
       
       <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
         <div className="mb-4 flex items-center justify-between">
           <h2 className="text-xl font-bold text-gray-900">
             {condominio ? 'Editar' : 'Novo'} Condomínio
           </h2>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             <X className="h-6 w-6" />
           </button>
         </div>

         <form onSubmit={handleSubmit}>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700">Nome</label>
               <input
                 type="text"
                 value={formData.nome}
                 onChange={e => setFormData({...formData, nome: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">Endereço</label>
               <input
                 type="text"
                 value={formData.endereco}
                 onChange={e => setFormData({...formData, endereco: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 required
               />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Cidade</label>
                 <input
                   type="text"
                   value={formData.cidade}
                   onChange={e => setFormData({...formData, cidade: e.target.value})}
                   className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                   required
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Estado</label>
                 <input
                   type="text"
                   value={formData.estado}
                   onChange={e => setFormData({...formData, estado: e.target.value})}
                   className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                   maxLength={2}
                   required
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">CEP</label>
               <input
                 type="text"
                 value={formData.cep}
                 onChange={e => setFormData({...formData, cep: e.target.value})}
                 className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                 maxLength={8}
                 required
               />
             </div>
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
               {condominio ? 'Salvar' : 'Criar'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
};

export default CondominioModal;