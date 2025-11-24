import { useQuery } from "@tanstack/react-query";

type Categorie = {
    id_categorie: number;
    nom_categorie: string;
};
export const useCategories = () => {
    return useQuery<Categorie[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch("http://localhost:5191/api/categories");
            if (!res.ok) throw new Error("Erreur lors de la récupération des catégories");
            const data = await res.json();
            console.log("Catégories récupérées:", data); // ← Ici
            return data;
        }
    });
};
