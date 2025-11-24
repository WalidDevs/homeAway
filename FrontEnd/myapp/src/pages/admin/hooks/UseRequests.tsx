import { useState, useEffect } from "react";
import { toast } from "react-toastify";
export type Request = {
    id_demande: number;
    email_demande: string;
    motif_demande: string;
    statut_demande: string;
    id_utilisateur: string;
};
export const useRequests = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Utilisateur non authentifié.");
            }
            const response = await fetch("http://localhost:5191/api/demandes", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des demandes.");
            }

            const data: Request[] = await response.json();
            setRequests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateRequestStatus = async (id: number, status: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Utilisateur non authentifié.");
            }

            const response = await fetch(`http://localhost:5191/api/demandes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ statut_demande: status }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la demande.");
            }

            toast.success(`Demande ${status === "acceptée" ? "acceptée" : "rejetée"} avec succès !`);
            fetchRequests();
        } catch (error) {
            console.error(error);
        }
    };

    return { requests, loading, updateRequestStatus };
};
