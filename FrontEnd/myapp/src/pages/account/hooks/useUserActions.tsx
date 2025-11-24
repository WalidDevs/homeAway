import { useState } from "react";

type UserData = {
    Nom: string;
    Prenom: string;
    Email: string;
    Num_phone: string;
    Sexe: string;
    Ville: string;
    Mot_de_passe?: string;
};
export const useUserActions = () => {
    const [loading, setLoading] = useState(false);
    const updateUser = async (userId: string, userData: UserData): Promise<boolean> => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error(" Aucun token trouvé, l'utilisateur doit se reconnecter.");
                return false;
            }
            console.log(" Mise à jour utilisateur ID:", userId);
            console.log(" Données envoyées avant filtrage:", userData);
            if (!userData.Nom || userData.Nom.trim() === "") {
                console.error(" Erreur: Le champ 'Nom' est vide !");
                setLoading(false);
                return false;
            }

            const filteredData: Partial<UserData> = { ...userData };
            if (!filteredData.Mot_de_passe) {
                delete filteredData.Mot_de_passe;
            }

            console.log(" Données envoyées après filtrage:", JSON.stringify(filteredData, null, 2));
            const response = await fetch(`http://localhost:5191/api/utilisateurs/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filteredData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(" Erreur mise à jour:", errorMessage);
                return false;
            }

            console.log(" Mise à jour réussie !");
            return true;
        } catch (error) {
            console.error(" Erreur modification (catch):", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId: string): Promise<boolean> => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error(" Aucun token trouvé, l'utilisateur doit se reconnecter.");
                return false;
            }

            console.log(" Suppression utilisateur ID:", userId);

            const response = await fetch(`http://localhost:5191/api/utilisateurs/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(" Erreur suppression:", errorMessage);
                return false;
            }

            console.log(" Suppression réussie !");
            return true;
        } catch (error) {
            console.error(" Erreur suppression (catch):", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateUser, deleteUser, loading };
};
