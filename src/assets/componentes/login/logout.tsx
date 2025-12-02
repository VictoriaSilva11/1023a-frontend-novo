import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("tipousuario");

        setTimeout(() => {
            navigate("/login?mensagem=" + encodeURIComponent("Logout realizado com sucesso!"));
        }, 2500);
    }, []);


    return (
        <div className="logout-container">
            <div className="logout-box">
                <h2>Saindo...</h2>
                <p className="logout-msg">Logout realizado com sucesso! Redirecionando...</p>
            </div>
        </div>
    );
}

export default Logout;
