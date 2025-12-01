import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Login from './assets/componentes/login/login.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Produtos from './paginas/Produtos.tsx';
import Home from './paginas/Home.tsx';
import Admin from './paginas/Admin.tsx';
import Carrinhos from './paginas/Carrinho.tsx';
import FinalizarCompra from './paginas/FinalizarCompra.tsx';

// IMPORTS DO STRIPE
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/carrinho" element={<Carrinhos />} />
        <Route path="/adm" element={<Admin />} />
        <Route path="/pagar" element={<FinalizarCompra />} />

        {/* ROTA DO PAGAMENTO ENVOLVIDA COM <Elements> */}
        <Route
          path="/finalizar-compra"
          element={
            <Elements stripe={stripe}>
              <FinalizarCompra />
            </Elements>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
