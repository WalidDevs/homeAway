import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export type DecodedToken = {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    exp: number;
};
export interface User {
    id: string;
    Nom: string;
    Prenom: string;
    Email: string;
    role: string;
    Num_phone: string;
    Sexe: string;
    Ville: string;
}
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, mot_de_passe: string) => Promise<boolean>;
    logout: () => void;
    fetchUserInfo: () => Promise<User | null>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    const fetchUserInfo = async (): Promise<User | null> => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return null;

        try {
            const response = await fetch(`http://localhost:5191/api/utilisateurs/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) return null;

            const userData = await response.json();

            const formattedUser: User = {
                id: userData.id_utilisateur?.toString() || userId,
                Nom: userData.nom,
                Prenom: userData.prenom,
                Email: userData.email,
                role: localStorage.getItem("role") || "",
                Num_phone: userData.num_phone,
                Sexe: userData.sexe,
                Ville: userData.ville,
            };

            setUser(formattedUser);
            return formattedUser;
        } catch (error) {
            console.error("Erreur lors du fetch user info:", error);
            return null;
        }
    };

    const login = async (email: string, mot_de_passe: string): Promise<boolean> => {
        try {
            const response = await fetch("http://localhost:5191/custom-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, mot_de_passe }),
            });

            if (!response.ok) return false;

            const result = await response.json();
            const token = result.token;

            localStorage.setItem("token", token);

            const decodedToken: DecodedToken = jwtDecode(token);
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const userEmail = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email;

            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);
            localStorage.setItem("email", userEmail);

            await fetchUserInfo();

            switch (role) {
                case "Administrateur":
                    navigate("/admin/dashboard");
                    break;
                case "Locataire":
                    navigate("/locataire/dashboard");
                    break;
                case "Propriétaire":
                    navigate("/proprietaire/dashboard");
                    break;
                default:
                    navigate("/");
            }

            return true;
        } catch (error) {
            console.error("Erreur API:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) fetchUserInfo();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, fetchUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
