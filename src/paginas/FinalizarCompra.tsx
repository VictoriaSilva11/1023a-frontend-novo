import CartaoPagamento from "../paginas/CartaoPagamento";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./Pagamento.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function FinalizarCompra() {
  return (
    <Elements stripe={stripePromise}>
      <CartaoPagamento />
    </Elements>
  );
}
