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

export default function AdminPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [usuariosCount, setUsuariosCount] = useState<number>(0);
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

  // 🔹 Carrega dados iniciais
  useEffect(() => {
    if (!token) {
      alert("Você precisa estar logado para acessar o painel administrativo.");
      navigate("/login");
      return;
    }

    async function carregarDados() {
      try {
        const [respProdutos, respUsuarios] = await Promise.all([
          api.get("/produtos", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/usuarios", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setProdutos(respProdutos.data);
        setUsuariosCount(respUsuarios.data.length);
      } catch (err: any) {
        console.error(err);
        setErro("Falha ao carregar informações. Verifique suas permissões.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [token, navigate]);

  // 🔹 Adicionar produto (nova função)
  async function adicionarProduto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      alert("Você precisa estar logado como administrador para adicionar produtos.");
      navigate("/login");
      return;
    }

    try {
      const resposta = await api.post("/produtos", novoProduto, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProdutos([...produtos, resposta.data]);
      setNovoProduto({ nome: "", preco: 0, descricao: "", urlfoto: "", categoria: "" });
      alert("✅ Produto adicionado com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert("❌ Erro ao adicionar produto. Verifique se você tem permissão.");
    }
  }

  // 🔹 Excluir produto
  async function excluirProduto(id: string) {
    if (!token) {
      alert("Você precisa estar logado para excluir produtos.");
      navigate("/login");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(produtos.filter((p) => p._id !== id));
      alert("Produto excluído com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert("Erro ao excluir produto.");
    }
  }

  // 🔹 Editar produto
  function iniciarEdicao(produto: Produto) {
    if (!token) {
      alert("Você precisa estar logado para editar produtos.");
      navigate("/login");
      return;
    }

    setProdutoEditando({ ...produto });
  }

  // 🔹 Salvar edição
  async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!produtoEditando) return;

    if (!token) {
      alert("Você precisa estar logado para salvar alterações.");
      navigate("/login");
      return;
    }

    try {
      await api.put(`/produtos/${produtoEditando._id}`, produtoEditando, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
              {/* 🔹 Resumo */}
              <section className="resumo-admin">
                <div className="card-info">
                  <h2>Usuários cadastrados</h2>
                  <p>{usuariosCount}</p>
                </div>
                <div className="card-info">
                  <h2>Produtos cadastrados</h2>
                  <p>{produtos.length}</p>
                </div>
              </section>

              {/* 🔹 Formulário para adicionar novo produto */}
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

              {/* 🔹 Lista de produtos existentes */}
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
                            setProdutoEditando({
                              ...produtoEditando,
                              nome: e.target.value,
                            })
                          }
                          placeholder="Nome"
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
                          placeholder="Preço"
                        />
                        <input
                          type="text"
                          value={produtoEditando.categoria}
                          onChange={(e) =>
                            setProdutoEditando({
                              ...produtoEditando,
                              categoria: e.target.value,
                            })
                          }
                          placeholder="Categoria"
                        />
                        <textarea
                          value={produtoEditando.descricao}
                          onChange={(e) =>
                            setProdutoEditando({
                              ...produtoEditando,
                              descricao: e.target.value,
                            })
                          }
                          placeholder="Descrição"
                        />
                        <input
                          type="text"
                          value={produtoEditando.urlfoto}
                          onChange={(e) =>
                            setProdutoEditando({
                              ...produtoEditando,
                              urlfoto: e.target.value,
                            })
                          }
                          placeholder="URL da imagem"
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
            </>
          )}
        </main>
      </div>
    </>
  );
}
