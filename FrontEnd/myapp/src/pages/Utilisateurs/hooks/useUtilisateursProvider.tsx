import { useMutation, useQueryClient } from "@tanstack/react-query";

export type Utilisateur = {
    id: string;
    nom: string;
    prenom: string;
    num_phone: string;
    ville: string;
    sexe: string;
    email: string;
    mot_de_passe: string;
};

export const useCreateUtilisateur = () => {
    type Input = Omit<Utilisateur, "id">;
    const queryClient = useQueryClient();

    return useMutation<Utilisateur, Error, Input>({
        mutationFn: async (userData) => {
            const response = await fetch("http://localhost:5191/api/utilisateurs/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error("Erreur lors de l'inscription");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
        },
    });
};
