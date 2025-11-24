import { useQuery } from "@tanstack/react-query";
import { Logement } from "../types/logementTypes.tsx";

export const useLogements = (proprietaireId: string | number | null) => {
    return useQuery<Logement[]>({
        queryKey: ["logements", proprietaireId],
        enabled: !!proprietaireId,
        queryFn: async () => {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token manquant");

            const res = await fetch(
                `http://localhost:5191/api/logements/proprietaire/${proprietaireId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error(await res.text());
            const data: Logement[] = await res.json();

            return data.map((logement) => ({
                ...logement,
                
            }));
        },
    });
};
