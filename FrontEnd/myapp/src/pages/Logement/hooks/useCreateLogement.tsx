import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateLogement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: FormData) => {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5191/api/logements", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });
            if (!res.ok) throw new Error("Erreur création logement");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logements"] });
        },
    });
};

