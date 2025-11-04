import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";

function Login() {
    const [searchParams] = useSearchParams();
    const mensagem = searchParams.get("mensagem");
    const navigate = useNavigate();

    function handleForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const senha = formData.get("senha");

        api.post("/login", { email, senha })
            .then((response) => {
                if (response.status === 200) {
                    // 🔹 Aqui salvamos o token e o tipo de usuário
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("tipoUsuario", response.data.tipoUsuario);

                    // Redireciona para a home
                    navigate("/");
                }
            })
            .catch((error: any) => {
                const msg = error?.response?.data?.mensagem ??
                    error?.message ??
                    "Erro desconhecido.";
                navigate(`/login?mensagem=${encodeURIComponent(msg)}`);
            });
    }

    return (
        <>
            {mensagem && <p>{mensagem}</p>}
            <form onSubmit={handleForm}>
                <input type="text" name="email" placeholder="Email" />
                <input type="password" name="senha" placeholder="Senha" />
                <input type="submit" value="Logar" />

            </form>
        </>
    );
}

export default Login;
