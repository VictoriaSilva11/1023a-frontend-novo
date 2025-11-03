import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("tipoUsuario");
        navigate("/login?mensagem=Logout realizado com sucesso");
    }, [navigate]);

    return null; // nada é renderizado
}

export default logout;
