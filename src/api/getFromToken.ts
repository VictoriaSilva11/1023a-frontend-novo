import { jwtDecode } from "jwt-decode";

interface TokenData {
  usuarioId: string;
  nome: string;
  tipo: string;
}

export function getUserFromToken(): TokenData | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<TokenData>(token);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}
