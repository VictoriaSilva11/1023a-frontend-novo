// src/api/api.ts
import axios from "axios";

// 🔹 Cria a instância do Axios com a URL base vinda do arquivo .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ex: http://localhost:3000
});

// 🔹 Interceptor de requisição:
// Adiciona o token de autenticação (se existir) a cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 Interceptor de resposta:
// Se o backend retornar 401, redireciona o usuário para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    

    if (
      status === 401 &&
      !(error?.response?.config?.url.endsWith("/login"))
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login?mensagem=Token_expirado!";
    }

    return Promise.reject(error);
  }
);

export default api;
