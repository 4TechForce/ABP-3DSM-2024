import { ReactNode } from "react";

export interface UserContextProps {
    loading: boolean;
    users: UserProps[] | null;
    token: TokenProps | null;
    userId?: string | null;
    profile: ProfileProps | null;
    setToken: (value: TokenProps | null) => void;
    login: (mail: string, password: string) => Promise<void>;
    logout: () => void;
    create: (
        alias: string,
        mail: string,
        password: string,
        idade: string,
        peso: number,
        altura: number,
        genero: string,
        nivelAtividade: string,
        objetivoDieta: string,
        pesoAlvo: number
    ) => Promise<void>;
    getUsers: () => Promise<void>;
    updateRole: (id: string, role: string) => Promise<boolean>;
    error: ErrorProps | null;
    setError: (error: ErrorProps | null) => void;
    updateAlias: (alias: string) => Promise<boolean>;
    updateMail: (mail: string) => Promise<boolean>;
    updatePassword: (password: string) => Promise<boolean>;
    saveProfile: (
        birth_date: string,
        weight: string,
        sex: string
    ) => Promise<boolean>;
    deleteProfile: () => Promise<boolean>;
}

// Definindo o tipo para os valores que incluem unidade de medida
export interface ValueProps {
    label: string;
    value: number | null;
    unit: string;
}

// Estrutura de erro
export interface ErrorProps {
    error: string;
}

// Propriedades para o provedor de contexto
export interface ProviderProps {
    children: ReactNode;
}

// Definição de um usuário básico
export interface UserProps {
    id: string;
    alias: string;
    mail: string;
    idade: string;
    peso: number;
    altura: number;
    role: string;
}

// Definição para o token, que inclui as propriedades de um usuário e o token em si
export interface TokenProps extends UserProps {
    token: string;
    userId: string;
}

// Definição de perfil do usuário
export interface ProfileProps {
    birth_date: string;
    weight: string;
    sex: string;
}

// Informações sobre produtos alimentares consumidos
export interface EatProductProps {
    id: string;
    date: string;
    quantity: number;
    description: string;
    serving_size: number;
    serving_size_unit: string;
    quantity_per_serving: number;
    quantity_per_serving_unit: string;
    energy: number | null;
    protein: number | null;
    carbohydrate: number | null;
    sugar: number | null;
    dietary_fiber: number | null;
    total_fat: number | null;
    saturated_fat: number | null;
    trans_fat: number | null;
    calcium: number | null;
    sodium: number | null;
}

// Informações sobre alimentos consumidos
export interface EatFoodProps {
    id: string;
    date: string;
    quantity: number;
    description: string;
    energy: number | null;
    protein: number | null;
    carbohydrate: number | null;
    dietary_fiber: number | null;
    calcium: number | null;
    sodium: number | null;
}
