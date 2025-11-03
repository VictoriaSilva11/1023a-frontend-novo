import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './Produtos.css';

type livro = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  ano_publicacao: number;
  preco: string;
  imagemUrl: string;
};

function Livros() {
  const [livros, setlivros] = useState<livro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchlivros() {
      try {
        const response = await fetch('http://localhost:8000/livros'); 
        if (!response.ok) {
          throw new Error(`Erro ao buscar livros: ${response.statusText}`);
        }
        const data: livro[] = await response.json();
        setlivros(data);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchlivros();
  }, []);

  if (loading) {
    return <p>Carregando livros...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <>
      <Header />
      <section className="imagem">
        <img
          src="https://preview.redd.it/i-made-a-stormlight-arc-1-4k-wallpaper-by-combining-all-the-v0-gmanmn7emisd1.png?auto=webp&s=3fdf7e3fc4b41ab549d556705a1ba9dd057b5ebb"
          alt="Stormlight Arc wallpaper"
        />
      </section>

      <div className="livros">
        {livros.map((livro) => (
          <div className="card" key={livro.id}>
            <img src={livro.imagemUrl} alt={`Capa do livro ${livro.titulo}`} />
            <h3>{livro.titulo}</h3>
            <h4>Autor: {livro.autor}</h4>
            <h4>Genero: {livro.genero}</h4>
            <p>
              <u>{livro.preco}</u>R$
            </p>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
} 

export default Livros;