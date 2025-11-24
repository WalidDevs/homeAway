import { useState } from "react";
export function useDeleteLogement() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    async function deleteLogement(id: number) {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/logements/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la suppression du logement");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Une erreur inconnue est survenue.");
            }
        } finally {
            setLoading(false);
        }
    }

    return { deleteLogement, loading, error };
}
