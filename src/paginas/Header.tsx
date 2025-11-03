import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    return (
        <header className="cabecalho">
            <div className="logo"> 
                <Link to="/">44Books</Link>
            </div>
            <nav className="menu">
                <Link to="/Home">Home</Link>
                <Link to="/Livros">Livros</Link>
                <Link to="/Admin">Admin</Link>
            </nav>
        </header>
    );
}