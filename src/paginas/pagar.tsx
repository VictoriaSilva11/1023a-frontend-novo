import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Pagar() {
  const navigate = useNavigate();

  useEffect(() => {
    async function iniciarPagamento() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        navigate("/login");
        return;
      }

      // BUSCA O CARRINHO
      const carrinho = await api.get("/carrinho/listar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ENVIA OS ITENS PARA O BACKEND DO STRIPE
      const resposta = await api.post(
        "/stripe/pagar",
        { items: carrinho.data.itens },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = resposta.data.url;
    }

    iniciarPagamento();
  }, []);

  return <h2>Redirecionando para o pagamento...</h2>;
}
