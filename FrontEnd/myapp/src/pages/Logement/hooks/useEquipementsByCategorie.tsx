import { useQuery } from "@tanstack/react-query";
type Equipement = {
    id_equipement: number;
    nom_equipement: string;
};
export const useEquipementsByCategorie = (id_categorie: string) => {
    return useQuery<Equipement[]>({
        queryKey: ["equipements", id_categorie],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5191/api/equipements/categorie/${id_categorie}`);
            if (!res.ok) throw new Error("Erreur lors de la récupération des équipements");
            return res.json();
        },
        enabled: !!id_categorie,
    });
};
