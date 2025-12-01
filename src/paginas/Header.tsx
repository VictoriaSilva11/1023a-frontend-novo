import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserFromToken } from "../api/getFromToken";
import './Header.css';

export default function Header() {
  const [usuario, setUsuario] = useState<{ nome: string; tipo: string } | null>(null);

  useEffect(() => {
    const data = getUserFromToken();
    setUsuario(data);
  }, []);

  return (
    <header className="cabecalho">

      <div className="logotipo">
        <Link to="/home">GEEK.HUB</Link>
      </div>

      <nav className="navegacao">
        <ul className="links-navegacao">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/produtos">Produtos</Link></li>
          <li><Link to="/carrinho">Carrinho</Link></li>
          <li><Link to="/logout">Logout</Link></li>
          <li> {}
      <div className="usuario-info">
        {usuario ? (
          <>
            <span className="icone-usuario">👤</span>
            <span className="usuario-nome">{usuario.nome}</span>
            <span className="usuario-tipo">({usuario.tipo})</span>
          </>
        ) : (
          <span className="usuario-nome">Visitante</span>
        )}
      </div></li>
          <li><Link to="/adm">Administrador</Link></li>
        </ul>
      </nav>


    </header>
  );
}
