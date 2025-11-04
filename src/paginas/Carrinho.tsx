import React, { useState, useEffect } from "react";
import axios from "axios";

function Carrinho() {
    const [carrinho, setCarrinho] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    //  para carregar o carrinho
    const carregarCarrinho = () => {
        setLoading(true);
        axios
            .get("http://localhost:3000/carrinho/listar", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCarrinho(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        carregarCarrinho();
    }, []);

    //  para atualizar a lista --rayka
    const atualizarLista = () => {
        carregarCarrinho();
        alert("Lista atualizada!");
    };

    //  para remover item do carrinho---rayka
    const excluirItemCarrinho = async (produtoId, nomeProduto) => {
        if (!window.confirm(`Você deseja remover "${nomeProduto}" do carrinho?`)) return;

        try {
            await axios.delete("http://localhost:3000/carrinho/item/excluir", {
                headers: { Authorization: `Bearer ${token}` },
                data: {
                    usuarioId: carrinho.usuarioId,
                    produtoId: produtoId
                },
            });
            alert("Item removido do carrinho com sucesso!");
            // Atualizar a lista
            carregarCarrinho();
        } catch (error) {
            console.error(error);
            alert("Erro ao remover item do carrinho");
        }
    };

    // para excluir carrinho inteiro
    const excluirCarrinho = async () => {
        if (!window.confirm("Tem certeza que deseja excluir o carrinho inteiro?")) return;
        try {
            await axios.delete("http://localhost:3000/carrinho/excluir", {
                headers: { Authorization: `Bearer ${token}` },
                data: { usuarioId: carrinho.usuarioId },
            });
            alert("Carrinho excluído com sucesso!");
            setCarrinho(null);
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir o carrinho");
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!carrinho) return <p>Seu carrinho está vazio.</p>;

    return (
        <div className="carrinho-container">
            <div className="carrinho-header">
                <h2>Meu Carrinho</h2>
                <button onClick={atualizarLista} className="btn-atualizar">
                    Atualizar Lista
                </button>
            </div>

            <div className="lista-itens">
                <h3>Itens no carrinho ({carrinho.itens.length})</h3>
                <ul>
                    {carrinho.itens.map((item) => (
                        <li key={item.produtoId} className="item-carrinho">
                            <div className="info-produto">
                                <strong>{item.nome}</strong>
                                <div className="detalhes-produto">
                                    <span>Quantidade: {item.quantidade}x</span>
                                    <span>Preço unitário: R${item.precoUnitario}</span>
                                    <span className="subtotal">
                                        Subtotal: R${(item.quantidade * item.precoUnitario).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => excluirItemCarrinho(item.produtoId, item.nome)}
                                className="btn-remover-item"
                            >
                                Remover Item
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="carrinho-footer">
                <p className="total"><strong>Total do Carrinho:</strong> R${carrinho.total}</p>

                <div className="botoes-acao">
                    <button onClick={atualizarLista} className="btn-atualizar">
                        Atualizar Lista
                    </button>
                    <button onClick={excluirCarrinho} className="btn-excluir-carrinho">
                        Excluir Carrinho Inteiro
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Carrinho;