import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Home.css';

type Produto = {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
  categoria: string;
};

function Home() {
  const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await fetch('http://localhost:8000/produtos');
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        const produtosData: Produto[] = await response.json();
        
        // Seleciona 3 produtos aleatórios para destaque
        const shuffled = [...produtosData].sort(() => 0.5 - Math.random());
        setProdutosDestaque(shuffled.slice(0, 3));
        
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  }, []);

  const irParaProdutos = () => {
    navigate('/produtos');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error">
          <h2>Erro</h2>
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bem-vindo ao GEEK.HUB</h1>
          <p>Encontre os melhores produtos geek, colecionáveis e muito mais!</p>
          <button className="cta-button" onClick={irParaProdutos}>
            Ver Todos os Produtos
          </button>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn.cosmos.so/a09b262e-4a7c-4982-8631-ca4a5f16eee1?format=jpeg"
            alt="Universo Geek"
          />
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="destaque-section">
        <div className="container">
          <h2>Destaques</h2>
          <div className="produtos-grid">
            {produtosDestaque.map((produto) => (
              <div key={produto._id} className="produto-card">
                <img 
                  src={produto.urlfoto} 
                  alt={produto.nome}
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/260x200?text=Sem+Imagem')}
                />
                <div className="produto-info">
                  <h3>{produto.nome}</h3>
                  <p className="produto-descricao">{produto.descricao}</p>
                  <p className="produto-categoria">{produto.categoria}</p>
                  <div className="produto-preco">R$ {produto.preco.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botão para ver mais produtos */}
          <div className="ver-mais-container">
            <button className="ver-mais-button" onClick={irParaProdutos}>
              Ver Todos os Produtos
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;