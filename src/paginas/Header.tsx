import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="cabecalho">
      <div className="logotipo">
        <img className="logo-imagem" src="https://cdn.cosmos.so/39bbcf52-e34b-4746-b320-59f0111b3075?format=jpeg" alt="GEEK.HUB" />
        <Link to="/home">GEEK.HUB</Link>
        
      </div>
      <nav className="navegacao">
        <ul className="links-navegacao">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/produtos">Produtos</Link></li>
          <li><Link to="/carrinho">Carrinho</Link></li>
          <li><Link to="/adm">Adiministrador</Link></li>
        </ul>
      </nav>
    </header>
  );
}