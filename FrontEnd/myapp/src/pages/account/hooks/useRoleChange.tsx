import { useState } from "react";
import { toast } from "react-toastify";
import {useAuth} from "../../Login/hooks/useAuth.tsx";

export const useRoleChange = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const requestRoleChange = async (email: string, motif: string): Promise<boolean> => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Aucun token trouvé !");
                toast.error("Erreur d'authentification, veuillez vous reconnecter.");
                return false;
            }

            if (!user || !user.id) {
                console.error("Utilisateur non connecté ou ID manquant.");
                toast.error("Utilisateur non connecté.");
                return false;
            }
            const requestBody = {
                email_demande: email,
                motif_demande: motif,
                statut_demande: "en attente",
                id_utilisateur: user.id,
            };
            console.log("🔹 Données envoyées :", requestBody);
            const response = await fetch("http://localhost:5191/api/demandes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(" Erreur API :", errorText);
                toast.error("Une erreur est survenue lors de la demande.");
                return false;
            }
            return true;
        } catch (error) {
            console.error(" Erreur de requête (catch) :", error);
            toast.error("Une erreur technique est survenue.");
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { requestRoleChange, loading };
};
