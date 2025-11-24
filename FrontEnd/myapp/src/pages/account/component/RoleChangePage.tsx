import { useState } from "react";
import { Input } from "../../../components/Input";
import { useRoleChange } from "../hooks/useRoleChange";
import { useAuth } from "../../Login/hooks/useAuth";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";
const RoleChangePage: React.FC = () => {
    const { user } = useAuth();
    const { requestRoleChange, loading } = useRoleChange();
    const [motif, setMotif] = useState("");

    if (!user) {
        return <p className="text-center mt-10 text-red-600">Utilisateur non connecté.</p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!motif.trim()) {
            toast.error("Veuillez entrer un motif.");
            return;
        }

        const success = await requestRoleChange(user.Email, motif);
        if (success) {
            toast.success("Demande envoyée avec succès !");
            setMotif("");
        } else {
            toast.error("Erreur lors de l'envoi de la demande.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="w-screen h-screen flex justify-center items-center bg-gray-100 pt-20">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                    <h2 className="text-3xl font-bold text-center text-blue-600 uppercase mb-6">
                        Demande de changement de rôle
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Champ Email (lecture seule) */}
                        <Input
                            id="email"
                            name="email"
                            label="Adresse Email"
                            value={user.Email}
                            onChange={() => {}}
                            placeholder=""
                            type="email"
                            className="bg-gray-200 cursor-not-allowed"
                        />

                        {/* Champ Motif (agrandi) */}
                        <div>
                            <label className="block font-semibold mb-1 text-black">Motif de la demande</label>
                            <textarea
                                id="motif"
                                name="motif"
                                value={motif}
                                onChange={(e) => setMotif(e.target.value)}
                                required
                                placeholder="Expliquez pourquoi vous souhaitez changer de rôle"
                                className="w-full border border-blue-300 rounded-lg p-3 bg-gray-100 text-black h-32 resize-none"
                            />
                        </div>

                        {/* Boutons avec espace entre eux */}
                        <div className="flex justify-between gap-4 mt-6">
                            <button
                                type="button"
                                className="w-1/2 bg-red-500 hover:bg-red-700 text-white py-3 px-3 rounded-lg text-lg"
                                onClick={() => window.history.back()}
                                disabled={loading}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-lg"
                                disabled={loading}
                            >
                                {loading ? "Envoi..." : "Envoyer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RoleChangePage;
