import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../api/api';

import Header from './Header';

import './Produtos.css';


interface Produto {

  _id: string;

  nome: string;

  preco: number;

  descricao: string;

  urlfoto: string;

  categoria: string;

}



export default function Produtos() {

  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState<string | null>(null);

  const [filtro, setFiltro] = useState(''); // campo de busca

  const navigate = useNavigate();



  useEffect(() => {

    async function buscarProdutos() {

      try {

        const resposta = await api.get("/produtos");

        setProdutos(resposta.data);

      } catch (err: any) {

        console.error(err);

        setErro('Falha ao carregar produtos. Tente novamente.');

      } finally {

        setCarregando(false);

      }

    }

    buscarProdutos();

  }, []);



  async function adicionarAoCarrinho(produto: Produto) {

    const token = localStorage.getItem('token');



    if (!token) {

      alert('VocE precisa estar logado para adicionar produtos ao carrinho.');

      navigate('/login');

      return;

    }
    try {
      await api.post("/carrinho/adicionar", { produtoId: produto._id, quantidade: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      alert(`${produto.nome} foi adicionado ao carrinho!`);
    } catch (error) {

      console.error(error);

      alert('Erro ao adicionar produto ao carrinho.');

    }

  }

  // filtro por categoria

  const produtosFiltrados = produtos.filter((produto) =>

    produto.categoria.toLowerCase().includes(filtro.toLowerCase())

  );



  return (

    <>

      <Header />

      <div className="pagina-produtos">

        <main className="conteudo-principal">

          <h1>Produtos</h1>



          {/* Barra de pesquisa */}

          <div className="barra-pesquisa">

            <input

              type="text"

              placeholder="Filtrar por categoria..."

              value={filtro}

              onChange={(e) => setFiltro(e.target.value)}

            />

          </div>



          {carregando && <p>Carregando produtos...</p>}

          {erro && <p className="erro">{erro}</p>}



          {!carregando && !erro && (

            <>

              <p className="numero-produtos">

                {produtosFiltrados.length} produto(s) encontrado(s)

              </p>



              {produtosFiltrados.length === 0 && (
                <p>Nenhum produto encontrado para essa categoria.</p>
              )}

              {produtosFiltrados.length > 0 && (
              <div className="grid-produtos">
                {produtosFiltrados.map((produto) => (
                  <div key={produto._id} className="card-produto">
                    <img
                      src={produto.urlfoto}
                      alt={produto.nome}
                      onError={(e) =>
                      (e.currentTarget.src =
                        'https://via.placeholder.com/260x200?text=Sem+Imagem')
                      }
                    />
                    <div className="info">
                      <h2>{produto.nome}</h2>
                      <p className="descricao">{produto.descricao}</p>
                      <p className="categoria">Categoria: {produto.categoria}</p>
                      <p className="preco">R$ {produto.preco.toFixed(2)}</p>
                      <button
                        className="botao-carrinho"
                        onClick={() => adicionarAoCarrinho(produto)}
                      >
                        Adicionar ao carrinho
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}

            </>

          )}

        </main>

      </div>

    </>

  );

}