import { useEffect, useState } from "react";

export type Reservation = {
    id_reservation: number;
    nom_locataire: string;
    email_locataire: string;
    date_debut: string;
    date_fin: string;
    statut: string;
    logementDescription: string;
    logementVille: string;
    images:string;
};


export const useReservationsEnAttente = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) {
            const parsed = Number(storedId);
            if (!isNaN(parsed) && parsed !== 0) {
                setUserId(parsed);
            } else {
                setUserId(0);
            }
        } else {
            setUserId(0);
        }
    }, []);

    const fetchReservations = async () => {
        if (!userId) return;
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5191/api/reservations/proprietaire/${userId}/reservations-en-attente`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setReservations(data);
        setLoading(false);
    };

    const updateStatut = async (reservationId: number, statut: string) => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5191/api/reservations/traiter/${reservationId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(statut),
        });
        fetchReservations(); // Refresh
    };

    useEffect(() => {
        if (userId && userId !== 0) {
            fetchReservations();
        }
    }, [userId]);

    return { reservations, loading, updateStatut, userId };
};
