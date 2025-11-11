import  { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

import './Home.css';


type Autor = {
  id: number;
  nome: string;
  imagemUrl: string;
  nacionalidade: string;
};

function Home() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAutores() {
      try {
        const response = await fetch('http://localhost:8000/autores');
        if (!response.ok) throw new Error('Erro ao buscar autores');
        const data: Autor[] = await response.json();
        setAutores(data);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchAutores();
  }, []);

  return (
    <>
      <Header />

          <section className="imagem-section">
        <img
          src="https://cdn.cosmos.so/0d475c72-a6b3-4e49-bd05-c645845d0ae7?format=jpeg"
        />
      </section>

      <section className="autores">
        <h2>Autores em Destaque</h2>
        {loading && <p>Carregando autores...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="cards">
          {autores.map((autor) => (
            <div className="card" key={autor.id}>
              <img src={autor.imagemUrl} alt={`Foto de ${autor.nome}`} />
              <h3>{autor.nome}</h3>
              <p>Nacionalidade: {autor.nacionalidade}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;