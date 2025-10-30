import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de Requisição: Adiciona o token ao cabeçalho
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta: Lida com erros globais (como token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verifica se é um erro 401 E se a mensagem NÃO é 'Credenciais inválidas.'
    // A mensagem de token expirado/inválido vem do seu authMiddleware no backend
    const errorMessage = error.response?.data?.message || ''; // Ajuste se a prop se chamar 'error'
    
    if (error.response && error.response.status === 401 && errorMessage === 'Token inválido ou expirado.') {
      // APENAS se for token inválido/expirado, trata como sessão expirada
      toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      localStorage.removeItem('token');
      // Adicionamos um pequeno delay para o usuário ver o toast antes do redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500); // Espera 1.5 segundos
    } else if (error.response && error.response.status === 401 && errorMessage === 'Token de autenticação não fornecido ou mal formatado.') {
       // Se não enviou token nenhum, também redireciona
       toast.error('Você precisa estar logado para acessar esta página.');
       localStorage.removeItem('token');
       setTimeout(() => {
        window.location.href = '/login';
       }, 1500); 
    }
    
    // Para todos os outros erros (incluindo 401 de 'Credenciais inválidas.'),
    // apenas rejeita a promise para que a função que chamou (ex: login) possa tratar.
    return Promise.reject(error);
  }
);

export default api;