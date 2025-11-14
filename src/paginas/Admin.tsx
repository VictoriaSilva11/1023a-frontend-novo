import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Header from "./Header";
import "./Admin.css";

interface Produto {
  _id?: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
  categoria: string;
}

interface RankingItem {
  nome: string;
  quantidade: number;
}

interface CarrinhoItem {
  produto?: {
    nome: string;
  };
  quantidade: number;
}

interface Carrinho {
  usuario?: {
    nome: string;
  };
  itens: CarrinhoItem[];
  total?: number;
}

export default function Admin() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [usuariosCount, setUsuariosCount] = useState<number>(0);
  const [usuariosComCarrinho, setUsuariosComCarrinho] = useState<number>(0);
  const [somaTotalCarrinhos, setSomaTotalCarrinhos] = useState<number>(0);
  const [rankingProdutos, setRankingProdutos] = useState<RankingItem[]>([]);
  const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [novoProduto, setNovoProduto] = useState<Produto>({
    nome: "",
    preco: 0,
    descricao: "",
    urlfoto: "",
    categoria: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Você precisa estar logado para acessar o painel administrativo.");
      navigate("/login");
      return;
    }

    async function carregarDados() {
      try {
        const [respProdutos, respUsuarios, respEstatisticas, respCarrinhos] = await Promise.all([
          api.get("/produtos"),
          api.get("/usuarios"),
          api.get("/admin/estatisticas"),
          api.get("/admin/carrinhos")
        ]);

        setProdutos(respProdutos.data);
        setUsuarios(respUsuarios.data);
        setUsuariosCount(respUsuarios.data.length);
        setUsuariosComCarrinho(respEstatisticas.data.usuariosComCarrinho);
        setSomaTotalCarrinhos(respEstatisticas.data.somaTotalCarrinhos);
        setRankingProdutos(respEstatisticas.data.rankingProdutos);
        setCarrinhos(respCarrinhos.data);
      } catch (err: any) {
        console.error(err);
        setErro("Falha ao carregar informações. Verifique suas permissões.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [token, navigate]);

  async function adicionarProduto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const resposta = await api.post("/produtos", novoProduto);
      setProdutos([...produtos, resposta.data]);
      setNovoProduto({ nome: "", preco: 0, descricao: "", urlfoto: "", categoria: "" });
      alert(" Produto adicionado com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert(" Erro ao adicionar produto. Verifique se você tem permissão.");
    }
  }

  async function excluirProduto(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${id}`);
      setProdutos(produtos.filter((p) => p._id !== id));
      alert("Produto excluído com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert("Erro ao excluir produto.");
    }
  }

  async function excluirUsuario(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await api.delete(`/usuarios/${id}`);

      setUsuarios((antes) => antes.filter((u) => u._id !== id));
      setUsuariosCount((count) => count - 1);

      alert("Usuário excluído com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir usuário.");
    }
  }


  function iniciarEdicao(produto: Produto) {
    setProdutoEditando({ ...produto });
  }

  async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!produtoEditando) return;

    try {
      await api.put(`/produtos/${produtoEditando._id}`, produtoEditando);
      setProdutos((produtosAnteriores) =>
        produtosAnteriores.map((p) =>
          p._id === produtoEditando._id ? produtoEditando : p
        )
      );
      setProdutoEditando(null);
      alert("Produto atualizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert("Erro ao atualizar produto.");
    }
  }

  function cancelarEdicao() {
    setProdutoEditando(null);
  }

  return (
    <>
      <Header />
      <div className="pagina-admin">
        <main className="conteudo-principal">
          <h1>Painel Administrativo</h1>

          {carregando && <p>Carregando informações...</p>}
          {erro && <p className="erro">{erro}</p>}

          {!carregando && !erro && (
            <>
              <section className="resumo-admin">
                <div className="card-info">
                  <h2>Usuários cadastrados</h2>
                  <p>{usuariosCount}</p>
                </div>
                <div className="card-info">
                  <h2>Produtos cadastrados</h2>
                  <p>{produtos.length}</p>
                </div>
                <div className="card-info destaque">
                  <h2>Usuários com carrinho</h2>
                  <p>{usuariosComCarrinho}</p>
                </div>
                <div className="card-info destaque">
                  <h2>Total vendido</h2>
                  <p>R$ {somaTotalCarrinhos.toFixed(2)}</p>
                </div>
              </section>

              <section className="ranking-produtos">
                <h2>Top Produtos Mais Vendidos</h2>
                <ul>
                  {rankingProdutos.map((item, index) => (
                    <li key={index}>
                      <span>{index + 1}º - {item.nome}</span>
                      <strong>{item.quantidade} unid.</strong>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="adicionar-produto">
                <h2>Adicionar Novo Produto</h2>
                <form onSubmit={adicionarProduto} className="form-adicionar">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={novoProduto.nome}
                    onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Preço"
                    value={novoProduto.preco}
                    onChange={(e) => setNovoProduto({ ...novoProduto, preco: parseFloat(e.target.value) })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Categoria"
                    value={novoProduto.categoria}
                    onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Descrição"
                    value={novoProduto.descricao}
                    onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="URL da Imagem"
                    value={novoProduto.urlfoto}
                    onChange={(e) => setNovoProduto({ ...novoProduto, urlfoto: e.target.value })}
                    required
                  />
                  <button type="submit">Adicionar Produto</button>
                </form>
              </section>

              <h2>Gerenciar Produtos</h2>
              <div className="grid-produtos">
                {produtos.map((produto) => (
                  <div key={produto._id} className="card-produto">
                    {produtoEditando && produtoEditando._id === produto._id ? (
                      <form onSubmit={salvarEdicao} className="form-edicao">
                        <input
                          type="text"
                          value={produtoEditando.nome}
                          onChange={(e) =>
                            setProdutoEditando({ ...produtoEditando, nome: e.target.value })
                          }
                        />
                        <input
                          type="number"
                          value={produtoEditando.preco}
                          onChange={(e) =>
                            setProdutoEditando({
                              ...produtoEditando,
                              preco: parseFloat(e.target.value),
                            })
                          }
                        />
                        <input
                          type="text"
                          value={produtoEditando.categoria}
                          onChange={(e) =>
                            setProdutoEditando({ ...produtoEditando, categoria: e.target.value })
                          }
                        />
                        <textarea
                          value={produtoEditando.descricao}
                          onChange={(e) =>
                            setProdutoEditando({ ...produtoEditando, descricao: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          value={produtoEditando.urlfoto}
                          onChange={(e) =>
                            setProdutoEditando({ ...produtoEditando, urlfoto: e.target.value })
                          }
                        />
                        <div className="botoes-edicao">
                          <button type="submit">Salvar</button>
                          <button type="button" onClick={cancelarEdicao}>
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <img
                          src={produto.urlfoto}
                          alt={produto.nome}
                          onError={(e) =>
                          (e.currentTarget.src =
                            "https://via.placeholder.com/260x200?text=Sem+Imagem")
                          }
                        />
                        <div className="info">
                          <h3>{produto.nome}</h3>
                          <p>R$ {produto.preco.toFixed(2)}</p>
                          <p>{produto.categoria}</p>
                          <p className="descricao">{produto.descricao}</p>
                          <div className="botoes-admin">
                            <button className="editar" onClick={() => iniciarEdicao(produto)}>
                              Editar
                            </button>
                            <button className="excluir" onClick={() => excluirProduto(produto._id!)}>
                              Excluir
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              { }
              <section className="tabela-carrinhos">
                <h2>Carrinhos Criados</h2>

                {carrinhos.length === 0 ? (
                  <p>Nenhum carrinho encontrado.</p>
                ) : (
                  <table className="tabela-limpa">
                    <thead>
                      <tr>
                        <th>Usuário</th>
                        <th>Itens</th>
                        <th>Total (R$)</th>
                      </tr>
                    </thead>

                    <tbody>
                      {carrinhos.map((carrinho, index) => (
                        <tr key={index}>

                          { }
                          <td>{carrinho.nomeUsuario || "Usuário desconhecido"}</td>

                          <td>
                            {carrinho.itens
                              .map((item) =>
                                `${item.nome || "Produto não encontrado"} (${item.quantidade} unid.)`
                              )
                              .join(", ")}
                          </td>

                          <td>{(carrinho.total || 0).toFixed(2)}</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
              <section className="lista-usuarios">
                <h2>Usuários</h2>

                <table className="tabela-limpa">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.map((u: any) => (
                      <tr key={u._id}>
                        <td>{u.nome}</td>
                        <td>{u.email}</td>
                        <td>
                          <button className="excluir" onClick={() => excluirUsuario(u._id)}>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>


            </>
          )}
        </main>
      </div>
    </>
  );
}