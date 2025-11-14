import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api/api";
import "./login.css";

function Login() {
    const [searchParams] = useSearchParams();
    const mensagem = searchParams.get("mensagem");
    const navigate = useNavigate();

    function handleForm(event: React.FormEvent<HTMLFormElement>) { //formulario de login
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const senha = formData.get("senha");

        api.post("/login", { email, senha })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem("token", response.data.token); //salva no token
                    localStorage.setItem("tipoUsuario", response.data.tipoUsuario); //salva tipo de usuário
                    navigate("/");
                }
            })
            .catch((error: any) => { //tratamento de erro
                const msg = error?.response?.data?.mensagem ??
                    error?.message ??
                    "Erro desconhecido.";
                navigate(`/login?mensagem=${encodeURIComponent(msg)}`);
            });
    }

    return (
        <div className="login-container">
            <form onSubmit={handleForm}>
                <h2>Login</h2>

                {mensagem && (
                    <div className="mensagem-erro">
                        {mensagem}
                    </div>
                )}

                <input type="text" name="email" placeholder="Email" />
                <input type="password" name="senha" placeholder="Senha" />
                <input type="submit" value="Entrar" />
            </form>
        </div>
        
    );
}



export default Login;
