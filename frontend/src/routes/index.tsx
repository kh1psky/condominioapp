// src/routes/index.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Condominios from '../pages/Condominios';
import Unidades from '../pages/Unidades';
import Financeiro from '../pages/Financeiro';
import Manutencoes from '../pages/Manutencoes';
import Relatorios from '../pages/Relatorios';
import Register from '../pages/Register';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/condominios" element={<Condominios />} />
                <Route path="/unidades" element={<Unidades />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/manutencoes" element={<Manutencoes />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;