import { useState } from "react";
import {toast} from "react-toastify";

export type Request = {
    id: number;
    email: string;
    motif: string;
    statut: string;
    rolesActuels: string[];
};

export const useRequestById = () => {
    const [request, setRequest] = useState<Request | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRequestById = async (id: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Utilisateur non authentifié.");

            // Appel de la nouvelle route combinée
            const response = await fetch(`http://localhost:5191/api/demandes/avec-role/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Erreur lors de la récupération de la demande.");

            const data: Request = await response.json();
            setRequest(data);
        } catch (error) {
            console.error(error);
            setRequest(null);
        } finally {
            setLoading(false);
        }
    };


    const updateRequestStatus = async (id: number, status: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Utilisateur non authentifié.");

            const response = await fetch(`http://localhost:5191/api/demandes/${id}/traiter`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(status),
            });

            if (!response.ok) throw new Error("Erreur lors du traitement de la demande.");

            toast.success(`Demande Traiter avec succès !`);
            fetchRequestById(id);
        } catch (error) {
            console.error(error);
        }
    };


    return { request, loading, fetchRequestById, updateRequestStatus };
};
