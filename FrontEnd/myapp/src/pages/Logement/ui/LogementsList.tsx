import { useState } from "react";
import { useLogements } from "../hooks/useLogements";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MoreVertical } from "lucide-react";
import { ModifierLogementModal } from "../components/ModifierLogementModal.tsx";
import { Logement } from "../types/logementTypes";
export const LogementsList = () => {
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [selectedLogement, setSelectedLogement] = useState<Logement | null>(null);
    const queryClient = useQueryClient();

    const proprietaireId = localStorage.getItem("userId");
    const { data: logements, isLoading, error } = useLogements(proprietaireId);
    const handleMenuToggle = (id: number) => {
        setMenuOpen((prev) => (prev === id ? null : id));
    };
    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce logement ?")) {
            deleteLogementMutation.mutate(id);
        }
    };
    const deleteLogementMutation = useMutation({
        mutationFn: async (id: number) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5191/api/logements/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Erreur lors de la suppression du logement");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Logement supprimé avec succès !");
            queryClient.invalidateQueries({ queryKey: ["logements", proprietaireId] });
        },
        onError: () => {
            toast.error("Erreur lors de la suppression");
        },
    });

    if (!proprietaireId) {
        return <p className="text-red-500">Utilisateur non authentifié</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-6">
            {isLoading ? (
                <p className="text-center text-gray-500">Chargement des logements...</p>
            ) : error ? (
                <p className="text-red-500 text-center">Erreur : {error.message}</p>
            ) : !logements || logements.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500 text-lg">
                    Aucun logement disponible.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow p-4">
                    {logements.map((logement) => (
                        <div key={logement.id} className="flex items-center gap-4 border-b py-4">
                            <img
                                src={`data:image/png;base64,${logement.imageBytes}`}
                                alt={logement.description}
                                className="w-32 h-24 object-cover rounded-md"
                            />

                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{logement.description}</h3>
                                <div className="text-sm text-gray-500 flex flex-wrap gap-2 mt-1">
                                    <span>🏷️ {logement.type_log}</span>
                                    <span>🛏️ lit(s)</span>
                                    <span>📏 {logement.surface ?? "?"} m²</span>
                                    <span>📍 {logement.ville}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-cyan-600 font-bold text-xl">{logement.prix} €</p>
                                <p className="text-sm text-cyan-600">/nuit</p>
                            </div>

                            <div className="relative ml-2">
                                <button onClick={() => handleMenuToggle(logement.id)}>
                                    <MoreVertical />
                                </button>

                                {menuOpen === logement.id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                                        <button
                                            onClick={() => {
                                                setSelectedLogement(logement);
                                                setMenuOpen(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(logement.id)}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-100"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de modification */}
            {selectedLogement && (
                <ModifierLogementModal
                    isOpen={!!selectedLogement}
                    onClose={() => setSelectedLogement(null)}
                    logement={selectedLogement}
                />
            )}
        </div>
    );
};
