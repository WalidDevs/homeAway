import { createContext } from "react";

type User = {
    role: string;
    exp: number;
    nom: string;
    prenom: string;
    email: string;
    num_phone: string;
    sexe: string;
    ville: string;
};

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
