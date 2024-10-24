import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks";

export default function Logout(){
    const { logout } = useUser();
    const navigate = useNavigate();
  
    useEffect(() => {
      logout();
      navigate("/login"); // Redirecionar para a página de login após o logout
    }, [logout, navigate]);
  
    return null; // Não precisa renderizar nada
}