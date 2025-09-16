import { useEffect, useState } from 'react'
import './App.css'
type EstudanteType = {
  _id: string,
  nome: string,
  idade: number
}
function App() {
  useEffect(() => {
    fetch("/api/estudantes")
      .then((response) => response.json())
      .then((dados) => setEstudantes(dados))
  }, [])
  const [estudantes, setEstudantes] = useState<EstudanteType[]>([])
  const [nome, SetNome] = useState("")
  const [idade, SetIdade] = useState(0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const estudante = { nome, idade }
    fetch("/api/estudantes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(estudante)
    })
      .then((response) => response.json())
      .then((dados) => {
        setEstudantes([...estudantes, dados])
        SetNome("")
        SetIdade(0)
      })
  }

  return (
    <>
      <h1>Cadastro de Estudantes</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" value={nome}
          onChange={(e) => SetNome(e.target.value)} />

        <input type="number" placeholder="Idade" value={idade}
          onChange={(e) => SetIdade(Number(e.target.value))} />

        <button type="submit">Cadastrar</button>
      </form>

      <h1>Lista de estudantes</h1>
      <div className="container-estudantes">
        {
          estudantes.map((estudante) => {
            return (
              <div key={estudante._id}>
                <h2>{estudante.nome}</h2>
                <p>Idade: {estudante.idade}</p>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default App
