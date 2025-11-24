import { useMutation } from "@tanstack/react-query";
export interface ReservationPayload {
    date_debut: string;
    date_fin: string;
    type_reservation: string;
    statut: string;
    nbr_personnes: number;
    montant_total: number;
    id_logement: number;
    id_utilisateur: number;
}
export const useCreateReservation = () => {
    return useMutation({
        mutationFn: async (reservationData: ReservationPayload) => {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5191/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reservationData),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Erreur lors de la réservation");
            }

            return data;
        },
    });
};
