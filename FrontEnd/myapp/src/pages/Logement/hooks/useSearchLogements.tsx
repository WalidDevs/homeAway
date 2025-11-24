import { useQuery } from "@tanstack/react-query";

export type LogementFilters = {
    ville?: string;
    type_log?: string;
    prixMin?: number;
    prixMax?: number;
    surfaceMin?: number;
    surfaceMax?: number;
    dateDebut?: string;
    dateFin?: string;
    motCle?: string;
    idsEquipements?: number[];
    statut_logement: string;
};
export const useSearchLogements = (filters: LogementFilters) => {
    return useQuery({
        queryKey: ["search-logements", filters],
        queryFn: async () => {
            const res = await fetch("http://localhost:5191/api/logements/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filters),
            });
            if (!res.ok) throw new Error("Erreur lors du chargement des logements");
            return res.json();
        },
    });
};
