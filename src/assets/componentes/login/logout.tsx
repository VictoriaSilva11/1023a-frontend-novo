import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";


export default function Logout() {
    const navigate = useNavigate();


    useEffect(() => {
        // limpa dados de autenticação
        localStorage.removeItem("token");
        localStorage.removeItem("tipoUsuario");


        // mantém uma pequena transição visual antes de redirecionar
        const t = setTimeout(() => {
            navigate("/login?mensagem=Logout realizado com sucesso");
        }, 1200);


        return () => clearTimeout(t);
    }, [navigate]);


    return (
        <div className="logout-root">
            <div className="logout-card" role="status" aria-live="polite">
                <div className="logout-spinner" aria-hidden="true"></div>
                <div className="logout-text">
                    Você saiu com sucesso.
                    <span className="logout-sub">Redirecionando para a tela de login...</span>
                </div>
            </div>
        </div>
    );
}

return null; // nada é renderizado


export default logout;
