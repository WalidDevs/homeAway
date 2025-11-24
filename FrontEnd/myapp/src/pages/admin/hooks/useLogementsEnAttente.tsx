import { useEffect, useState } from "react";

export type Logement = {
    id_logement: number;
    surface: number;
    type_log: string;
    statut_logement: string;
    description: string;
    prix: number;
    ville: string;
    emailUtilisateur: string;
    equipements: string[];
    imageBase64: string;
};

export const useLogementsEnAttente = () => {
    const [logements, setLogements] = useState<Logement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchLogements = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5191/api/logements/en-attente", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            const json = await res.json();
            if (Array.isArray(json)) {
                setLogements(json);
            } else {
                console.error("Réponse inattendue du backend :", json);
                setLogements([]);
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            setLogements([]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatut = async (id: number, statut: string) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:5191/api/logements/${id}/traiter`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(statut),
            });

            fetchLogements();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
        }
    };

    useEffect(() => {
        fetchLogements();
    }, []);

    return { logements, loading, updateStatut };
};
