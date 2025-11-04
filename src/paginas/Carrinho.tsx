import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Carrinho.css"; // Importa o CSS do carrinho

function Carrinho() {
    const [carrinho, setCarrinho] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [excluindo, setExcluindo] = useState(false); // Estado para de excluir

    const token = localStorage.getItem("token"); // Recupera o token armazenado

 //carregar carinho p usuario
    const carregarCarrinho = () => {
        setLoading(true);
        axios
            .get("http://localhost:3000/carrinho/listar", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCarrinho(res.data))
            .catch((err) => {
                console.error("Erro ao carregar carrinho:", err);
                alert("Erro ao carregar o carrinho.");
            })
            .finally(() => setLoading(false));
    };

    // Carrega o carrinho assim que o componente e montado
    useEffect(() => {
        carregarCarrinho();
    }, []);

    // Atualiza a lista de itens do carrinho
    const atualizarLista = () => {
        carregarCarrinho();
        alert("Lista atualizada!");
    };

    //  Remove um item específico do carrinho
    const excluirItemCarrinho = async (produtoId: number, nomeProduto: string) => {
        if (!window.confirm(`Você deseja remover "${nomeProduto}" do carrinho?`)) return;

        try {
            await axios.delete("http://localhost:3000/carrinho/item/excluir", {
                headers: { Authorization: `Bearer ${token}` },
                data: {
                    usuarioId: carrinho.usuarioId,
                    produtoId: produtoId,
                },
            });
            alert("Item removido do carrinho com sucesso!");
            carregarCarrinho();
        } catch (error) {
            console.error(error);
            alert("Erro ao remover item do carrinho.");
        }
    };

    //  Exclui o carrinho inteiro
    const excluirCarrinho = async () => {
        if (!window.confirm("Tem certeza que deseja excluir o carrinho inteiro?")) return;

        setExcluindo(true);

        try {
            await axios.delete("http://localhost:3000/carrinho/excluir", {
                headers: { Authorization: `Bearer ${token}` },
                data: { usuarioId: carrinho.usuarioId },
            });
            alert("Carrinho excluido com sucesso!");
            setCarrinho(null); // Limpa o estado local do carrinho
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir o carrinho.");
        } finally {
            setExcluindo(false);
        }
    };


    if (loading) return <p>Carregando...</p>;
    if (!carrinho) return <p>Seu carrinho está vazio.</p>;

 
    return (
        <div className="carrinho-container">
            <div className="carrinho-header">
                <h2> Carrinho</h2>
                <button onClick={atualizarLista} className="btn-atualizar">
                    Atualizar Lista
                </button>
            </div>

            <div className="lista-itens">
                <h3>Itens no carrinho ({carrinho.itens.length})</h3>
                <ul>
                    {carrinho.itens.map((item: any) => (
                        <li key={item.produtoId} className="item-carrinho">
                            <div className="info-produto">
                                <strong>{item.nome}</strong>
                                <div className="detalhes-produto">
                                    <span>Quantidade: {item.quantidade}x</span>
                                    <span>Preco unitario: R${item.precoUnitario.toFixed(2)}</span>
                                    <span className="subtotal">
                                        Subtotal: R$
                                        {(item.quantidade * item.precoUnitario).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    excluirItemCarrinho(item.produtoId, item.nome)
                                }
                                className="btn-remover-item"
                            >
                                Remover Item
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="carrinho-footer">
                <p className="total">
                    <strong>Total do Carrinho:</strong> R${carrinho.total.toFixed(2)}
                </p>

                <div className="botoes-acao">
                    <button onClick={atualizarLista} className="btn-atualizar">
                        Atualizar Lista
                    </button>
                    <button
                        onClick={excluirCarrinho}
                        className="btn-excluir-carrinho"
                        disabled={excluindo}
                    >
                        {excluindo ? "Excluindo..." : "Excluir Carrinho Inteiro"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Carrinho;
