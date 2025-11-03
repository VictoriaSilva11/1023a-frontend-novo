import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './assets/componentes/login/login.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Produtos from './paginas/Produtos.tsx'
import Home from './paginas/Home.tsx'
import Admin from './paginas/Admin.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/produtos" element={<Produtos/>} />
          <Route path='/admin' element={<Admin/>} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)