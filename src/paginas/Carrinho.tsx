import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Header from './Header';
import './Carrinho.css';

interface ItemCarrinho {
  produtoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  imagem?: string;
  tamanho?: string;
  cor?: string;
}

interface Carrinho {
  _id?: string;
  usuarioId: string;
  itens: ItemCarrinho[];
  total: number;
  dataAtualizacao: string;
}

export default function Carrinho() {
  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarCarrinho() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Você precisa estar logado para acessar o carrinho.');
        navigate('/login');
        return;
      }

      try {
        const resposta = await api.get('/carrinho/listar', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCarrinho(resposta.data);
      } catch {
        setCarrinho(null);
      } finally {
        setCarregando(false);
      }
    }

    buscarCarrinho();
  }, [navigate]);

  async function atualizarQuantidade(produtoId: string, novaQuantidade: number) {
    if (novaQuantidade < 1) return;
    const token = localStorage.getItem('token');
    const resposta = await api.put(
      '/carrinho/atualizar',
      { produtoId, usuarioId: carrinho?.usuarioId, quantidade: novaQuantidade },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCarrinho(resposta.data);
  }

  async function removerItem(produtoId: string) {
    const itemParaRemover = carrinho?.itens.find(item => item.produtoId === produtoId);
    const nomeItem = itemParaRemover ? itemParaRemover.nome : 'o item';

    if (!window.confirm(`Tem certeza que deseja remover ${nomeItem} do carrinho?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const resposta = await api.delete('/carrinho/removerItem', {
        headers: { Authorization: `Bearer ${token}` },
        data: { produtoId, usuarioId: carrinho?.usuarioId },
      });

      
      const novoCarrinho = resposta.data && resposta.data.itens && resposta.data.itens.length > 0 ? resposta.data : null;
      setCarrinho(novoCarrinho);

      alert(`${nomeItem} foi removido do carrinho com sucesso!`);

    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      alert(`Falha ao remover ${nomeItem}. Por favor, tente novamente.`);
    }
  }
 
  async function limparCarrinhoInteiro() {
    if (!carrinho || carrinho.itens.length === 0) return;

    if (!window.confirm('Tem certeza que deseja limpar todo o carrinho?')) { //mensagem  de erro
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.delete('/carrinho/limpar', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCarrinho(null);
      alert('Carrinho limpo com sucesso!');

    } catch (error) {
      alert('Erro ao limpar carrinho');
    }
  }

  if (carregando) return <p>Carregando carrinho...</p>;

  return (
    <>
      <Header />
      <div className="pagina-carrinho">
        <main className="conteudo-principal">
          <h1>Meu Carrinho</h1>

          {!carrinho || carrinho.itens.length === 0 ? (
            <p className="carrinho-vazio">Seu carrinho esta vazio.</p>
          ) : (
            <>
              <div className="lista-itens">
                {carrinho.itens.map((item) => (
                  <div key={item.produtoId} className="item-carrinho">
                    {/* iNFORMAÇÕES DO PRODUTO REFEITAS AQUI */}
                    <img
                      src={item.imagem || '/sem-imagem.png'}
                      alt={item.nome}
                      className="imagem-produto"
                    />

                    <div className="info-produto">
                      <h2>{item.nome}</h2>
                      <p className="preco">R${item.precoUnitario.toFixed(2)}</p>
                      <div className="opcoes">
                        {item.tamanho && <span>{item.tamanho}</span>}
                        {item.cor && <span>• {item.cor}</span>}
                      </div>
                    </div>

                    <div className="acoes">
                      <div className="quantidade">
                        <button onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}>-</button>
                        <span>{item.quantidade}</span>
                        <button onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}>+</button>
                      </div>
                      <button className="remover" onClick={() => removerItem(item.produtoId)}>
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="resumo">
                <p>Total: <strong>R$ {carrinho.total.toFixed(2)}</strong></p>
                <button className="finalizar">Finalizar Compra</button>
              </div>
              <div className="resumo">
                <p>Total: <strong>R$ {carrinho.total.toFixed(2)}</strong></p>

                <div className="botoes-acao">
                  <button
                    className="limpar-carrinho"
                    onClick={limparCarrinhoInteiro}
                  >
                    🗑️ Limpar Carrinho inteiro
                  </button>

                  <button className="finalizar">
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
} 