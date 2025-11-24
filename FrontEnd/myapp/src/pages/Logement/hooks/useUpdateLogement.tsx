import {useMutation, useQueryClient} from "@tanstack/react-query";
export const useUpdateLogement = (proprietaireId: string | number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:5191/api/logements/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            return res.json();
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["logements", proprietaireId] });
            queryClient.invalidateQueries({ queryKey: ["logement", id] });
        },
    });
};
