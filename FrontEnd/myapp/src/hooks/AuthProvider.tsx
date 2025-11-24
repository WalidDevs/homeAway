import { useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

type User = {
    role: string;
    exp: number;
    nom: string;
    prenom: string;
    email: string;
    num_phone: string;
    sexe: string;
    ville: string;};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (token) {
            try {
                const decoded: User = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Erreur lors du décodage du token :", error);
                setUser(null);
            }
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
