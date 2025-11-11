import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Header from './Header';
import './Produtos.css'; // reaproveita o estilo de produtos

interface ItemCarrinho {
  produtoId: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
}

interface Carrinho {
  _id?: string;
  usuarioId: string;
  itens: ItemCarrinho[];
  total: number;
  dataAtualizacao: string;
}

export default function Carrinhos() {
  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    buscarCarrinho();
  }, []);

  async function buscarCarrinho() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para ver o carrinho.');
      navigate('/login');
      return;
    }

    try {
      const resposta = await api.post(
        '/carrinhos/listar',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Carrinho carregado:', resposta.data);
      setCarrinho(resposta.data);
    } catch (err: any) {
      console.error('Erro ao carregar carrinho:', err);
      setErro('Carrinho não encontrado ou erro ao carregar.');
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarQuantidade(produtoId: string, novaQtd: number) {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (novaQtd < 1) {
      removerItem(produtoId);
      return;
    }

    try {
      const resposta = await api.post(
        '/carrinhos/atualizarquantidade',
        { produtoId, quantidade: novaQtd },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCarrinho(resposta.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar quantidade.');
    }
  }

  async function removerItem(produtoId: string) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const resposta = await api.post(
        '/carrinhos/removeritem',
        { produtoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Item removido!');
      setCarrinho(resposta.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao remover item.');
    }
  }

  async function limparCarrinho() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await api.post('/carrinhos/remover', {}, { headers: { Authorization: `Bearer ${token}` } });
      setCarrinho(null);
      alert('Carrinho limpo com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao limpar carrinho.');
    }
  }

  return (
    <>
      <Header />
      <div className="pagina-produtos">
        <main className="conteudo-principal">
          <h1>Meu Carrinho</h1>

          {carregando && <p>Carregando carrinho...</p>}
          {erro && <p className="erro">{erro}</p>}

          {!carregando && !erro && (
            <>
              {!carrinho || carrinho.itens.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
              ) : (
                <>
                  <p className="numero-produtos">
                    {carrinho.itens.length} item(ns) no carrinho
                  </p>

                  <div className="grid-produtos">
                    {carrinho.itens.map((item) => (
                      <div key={item.produtoId} className="card-produto">
                        <div className="info">
                          <h2>{item.nome}</h2>
                          <p>Preço unitário: R$ {item.precoUnitario.toFixed(2)}</p>

                          <div className="quantidade-controle">
                            <button onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}>
                              -
                            </button>
                            <span>{item.quantidade}</span>
                            <button onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}>
                              +
                            </button>
                          </div>

                          <p>
                            Subtotal: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                          </p>

                          <button className="botao-carrinho" onClick={() => removerItem(item.produtoId)}>
                    
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="resumo-carrinho">
                    <h2>Total: R$ {carrinho.total.toFixed(2)}</h2>
                    <button className="botao-carrinho" onClick={limparCarrinho}>
                      Limpar Carrinho
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
