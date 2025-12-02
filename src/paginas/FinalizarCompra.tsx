import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// ✅ CORREÇÃO DE CAMINHO: Ajuste conforme sua estrutura real. Ex:
import Header from "../paginas/Header"; 
// ✅ CORREÇÃO DE CAMINHO: Ajuste conforme sua estrutura real.
import CartaoPagamento from "./CartaoPagamento"; 
import "./Pagamento.css";

// 🆕 INTERFACE: Define o tipo do objeto Produto que está no localStorage
interface ProdutoCarrinho {
    _id?: string;
    id: string; 
    nome: string;
    preco: number;
    urlfoto: string;
    quantidade: number;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function FinalizarCompra() {
    
    let produtos: ProdutoCarrinho[] = [];

    try {
        const carrinhoData = localStorage.getItem("carrinho");
        produtos = JSON.parse(carrinhoData ?? "[]") as ProdutoCarrinho[];
    } catch {
        produtos = [];
    }

    return (
        <>
            <Header />

            <div className="pagamento-container">
                <div className="produtos-box">
                    <h2>Resumo da Compra</h2>
                    {produtos.length === 0 ? (
                        <p className="vazio">Nenhum produto no carrinho.</p>
                    ) : (
                        
                        produtos.map((p: ProdutoCarrinho) => (
                            <div key={p.id} className="produto-item">
                                <img src={p.urlfoto} alt={p.nome} />
                                <div>
                                    <h3>{p.nome}</h3>
                                    <p>Quantidade: {p.quantidade}</p>
                                    {}
                                    <p>R$ {p.preco.toFixed(2).replace('.', ',')}</p> 
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="form-box">
                    <Elements stripe={stripePromise}>
                        <CartaoPagamento />
                    </Elements>
                </div>
            </div>
        </>
    );
}