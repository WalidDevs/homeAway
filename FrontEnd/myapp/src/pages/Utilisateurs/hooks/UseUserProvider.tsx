import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export type User = {
    Id_utilisateur: number;
    Nom: string;
    Prenom: string;
    Num_phone: string;
    Ville: string;
    Sexe: string;
    Email: string;
    Mot_de_passe: string;
    Demandes: unknown[];
    Logements: unknown[];
    Roles: unknown[];
    Reservations: unknown[];
};
export const UseUserProvider = (userId: number | null) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Utilisateur non authentifié.");
                }

                const response = await fetch(
                    `http://localhost:5191/api/utilisateurs/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Échec de la récupération des données utilisateur");
                }

                const data: User = await response.json();
                setUser(data);
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : "Erreur inconnue";
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    return { user, loading, error };
};
