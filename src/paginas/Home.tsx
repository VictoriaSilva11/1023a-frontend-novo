import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Header from './Header';
import './Home.css';

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
  categoria: string;
}

export default function Home() {
  const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarDestaques() {
      try {
        const resposta = await api.get("/produtos");
        const todosProdutos: Produto[] = resposta.data;

        const embaralhados = [...todosProdutos].sort(() => 0.5 - Math.random());
        setProdutosDestaque(embaralhados.slice(0, 3));
      } catch (err: any) {
        console.error(err);
        setErro('Falha ao carregar produtos de destaque.');
      } finally {
        setCarregando(false);
      }
    }

    buscarDestaques();
  }, []);

  const irParaProdutos = () => navigate('/produtos');

  return (
    <>
      <Header />

      {/* Loader */}
      {carregando && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="error">
          <h2>Erro</h2>
          <p>{erro}</p>
        </div>
      )}

      {/* Conteúdo */}
      {!carregando && !erro && (
        <>
          {/* HERO */}
          <div className="hero-image">
              <img
                src="https://cdn.cosmos.so/a09b262e-4a7c-4982-8631-ca4a5f16eee1?format=jpeg"
                alt="Geek.Hub"
              />
            </div>

          {/* Destaques */}
          <section className="destaque-section">
            <h2>Destaques</h2>

            <div className="produtos-grid">
              {produtosDestaque.map((produto) => (
                <div key={produto._id} className="produto-card">
                  <img
                    src={produto.urlfoto}
                    alt={produto.nome}
                    onError={(e) =>
                      (e.currentTarget.src =
                        'https://via.placeholder.com/260x200?text=Sem+Imagem')
                    }
                  />

                  <div className="produto-info">
                    <h3>{produto.nome}</h3>
                    <p className="produto-descricao">{produto.descricao}</p>
                    <p className="produto-categoria">
                      Categoria: {produto.categoria}
                    </p>
                    <div className="produto-preco">
                      R$ {produto.preco.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ver-mais-container">
              <button className="ver-mais-button" onClick={irParaProdutos}>
                Ver Todos os Produtos
              </button>
            </div>
          </section>
        </>
      )}

     
    </>
  );
}
