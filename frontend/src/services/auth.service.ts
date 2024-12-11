// src/services/auth.service.ts
import api from './api';

export const AuthService = {
  async login(email: string, senha: string) {
    const response = await api.post('/usuarios/login', { email, senha });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  // ... outros métodos
};