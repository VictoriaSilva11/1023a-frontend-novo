import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './Admin.css';

interface Autor {
  id?: number;
  nome: string;
  nacionalidade: string;
  img: string;
}

interface Livro {
  id?: number;
  titulo: string;
  preco: number;
  genero: string;
  ano_publicacao: number;
  autor_id: number;
  img: string;
  autor?: string; // para exibir nome do autor na tabela
}

function Admin() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [autorForm, setAutorForm] = useState<Autor>({
    nome: '',
    nacionalidade: '',
    img: ''
  });
  const [livroForm, setLivroForm] = useState<Livro>({
    titulo: '',
    preco: 0,
    genero: '',
    ano_publicacao: 2024,
    autor_id: 0,
    img: ''
  });

  const fetchData = async () => {
    const autoresRes = await fetch('http://localhost:8000/autores');
    const autoresData = await autoresRes.json();
    setAutores(autoresData);

    const livrosRes = await fetch('http://localhost:8000/livros');
    const livrosData = await livrosRes.json();
    setLivros(livrosData);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAutorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutorForm({ ...autorForm, [e.target.name]: e.target.value });
  };

  const handleLivroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLivroForm({
      ...livroForm,
      [name]:
        name === 'autor_id' || name === 'preco' || name === 'ano_publicacao'
          ? Number(value)
          : value
    });
  };

  const submitAutor = async () => {
    const method = autorForm.id ? 'PUT' : 'POST';
    const url = autorForm.id ? `http://localhost:8000/autores/${autorForm.id}` : 'http://localhost:8000/autores';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(autorForm)
    });
    setAutorForm({ nome: '', nacionalidade: '', img: '' });
    fetchData();
  };

  const submitLivro = async () => {
    const method = livroForm.id ? 'PUT' : 'POST';
    const url = livroForm.id ? `http://localhost:8000/livros/${livroForm.id}` : 'http://localhost:8000/livros';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livroForm)
    });
    setLivroForm({ titulo: '', preco: 0, genero: '', ano_publicacao: 2024, autor_id: 0, img: '' });
    fetchData();
  };

  const deleteAutor = async (id: number) => {
    if (confirm('Deseja deletar este autor e seus livros?')) {
      await fetch(`http://localhost:8000/autores/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const deleteLivro = async (id: number) => {
    if (confirm('Deseja deletar este livro?')) {
      await fetch(`http://localhost:8000/livros/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <>
      <Header />

      <section className="imagem-section">
        <img
          src="https://images.alphacoders.com/128/thumb-1920-1285939.jpg"
          alt="Banner"
        />
      </section>

      <h2>Autores</h2>
      <div className="formulario">
        <input
          name="img"
          value={autorForm.img}
          placeholder="URL da Imagem do Autor"
          onChange={handleAutorChange}
        />
        <input
          name="nome"
          value={autorForm.nome}
          placeholder="Nome"
          onChange={handleAutorChange}
        />
        <input
          name="nacionalidade"
          value={autorForm.nacionalidade}
          placeholder="Nacionalidade"
          onChange={handleAutorChange}
        />
        <button onClick={submitAutor}>
          {autorForm.id ? 'Atualizar' : 'Adicionar'} Autor
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Nacionalidade</th>
            <th>Imagem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {autores.map((autor) => (
            <tr key={autor.id}>
              <td>{autor.id}</td>
              <td>{autor.nome}</td>
              <td>{autor.nacionalidade}</td>
              <td>
                {autor.img ? (
                  <img src={autor.img} alt={autor.nome} width={80} />
                ) : (
                  'Sem imagem'
                )}
              </td>
              <td>
                <button onClick={() => setAutorForm(autor)}>Editar</button>
                <button onClick={() => deleteAutor(autor.id!)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Livros</h2>
      <div className="formulario">
        <input
          name="img"
          value={livroForm.img}
          placeholder="URL da Capa do Livro"
          onChange={handleLivroChange}
        />
        <input
          name="titulo"
          value={livroForm.titulo}
          placeholder="Título"
          onChange={handleLivroChange}
        />
        <input
          name="preco"
          type="number"
          value={livroForm.preco}
          placeholder="Preço"
          onChange={handleLivroChange}
        />
        <input
          name="genero"
          value={livroForm.genero}
          placeholder="Gênero"
          onChange={handleLivroChange}
        />
        <input
          name="ano_publicacao"
          type="number"
          value={livroForm.ano_publicacao}
          placeholder="Ano"
          onChange={handleLivroChange}
        />
        <select
          name="autor_id"
          value={livroForm.autor_id}
          onChange={handleLivroChange}
        >
          <option value={0}>Selecione um autor</option>
          {autores.map((autor) => (
            <option key={autor.id} value={autor.id}>
              {autor.nome}
            </option>
          ))}
        </select>
        <button onClick={submitLivro}>
          {livroForm.id ? 'Atualizar' : 'Adicionar'} Livro
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Preço</th>
            <th>Gênero</th>
            <th>Imagem</th>
            <th>Ano</th>
            <th>Autor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map((livro) => (
            <tr key={livro.id}>
              <td>{livro.id}</td>
              <td>{livro.titulo}</td>
              <td>{livro.preco}</td>
              <td>{livro.genero}</td>
              <td>
                {livro.img ? (
                  <img src={livro.img} alt={livro.titulo} width={80} />
                ) : (
                  'Sem imagem'
                )}
              </td>
              <td>{livro.ano_publicacao}</td>
              <td>{livro.autor}</td>
              <td>
                <button
                  onClick={() =>
                    setLivroForm({
                      id: livro.id,
                      titulo: livro.titulo,
                      preco: livro.preco,
                      genero: livro.genero,
                      img: livro.img,
                      ano_publicacao: livro.ano_publicacao,
                      autor_id:
                        autores.find((a) => a.nome === livro.autor)?.id || 0
                    })
                  }
                >
                  Editar
                </button>
                <button onClick={() => deleteLivro(livro.id!)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Footer />
    </>
  );
}

export default Admin;