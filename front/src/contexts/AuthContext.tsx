import React, { createContext, useState, useContext, ReactNode } from "react";
import { api } from "../services/api";

interface AuthContextData {
    login: (mail: string, password: string) => Promise<void>;
    userId: string | null;
    token: string | null;
    error: { message: string } | null; // Adicione um estado de erro aqui
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<{ message: string } | null>(null);

    const login = async (mail: string, password: string) => {
        try {
            const response = await api.post("/login", { mail, password });
            console.log(response.data); // Verifique a resposta

            const { token, userId } = response.data;

            if (!userId) {
                throw new Error("User ID não encontrado na resposta da API.");
            }

            setToken(token);
            setUserId(userId);
            setError(null); // Limpa o erro

            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
        } catch (error) {
            console.error("Erro durante o login:", error);
            setError({ message: error instanceof Error ? error.message : "Erro desconhecido" });
        }
    };

    return (
        <AuthContext.Provider value={{ login, userId, token, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
