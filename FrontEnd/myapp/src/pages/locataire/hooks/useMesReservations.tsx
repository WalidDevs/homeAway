import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Reservation = {
    id_reservation: number;
    id_logement: number;
    date_debut: string;
    date_fin: string;
    statut: string;
    logementDescription: string;
    logementVille: string;
    images: string[];
    nom_locataire:string;
    email_locataire:string;
};
export const useMesReservations = () => {
    const queryClient = useQueryClient();
    const userId = Number(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");

    const { data: reservations = [], isLoading } = useQuery<Reservation[]>({
        queryKey: ["mesReservations"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5191/api/reservations/locataire/reservations-en-cours`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return await res.json();
        },
        enabled: !!userId,
    });

    const annulerReservation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`http://localhost:5191/api/reservations/annuler/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status===400) {
                throw new Error("impossible d'annuler , vous avez dépasser le deadline d'annulation");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mesReservations"] });
        },
    });

    return {
        reservations,
        isLoading,
        annulerReservation,
    };
};
