import { useQuery } from "@tanstack/react-query";

export type Equipement = {
    id_equipement: number;
    nom_equipement: string;
    id_categorie: number;
};
export const useEquipements = (logementId: number) => {
    return useQuery<Equipement[]>({
        queryKey: ["equipements", logementId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5191/api/equipements/logement/${logementId}`);
            if (!res.ok) throw new Error("Erreur lors de la récupération des équipements");
            return res.json();
        },
    });
};
