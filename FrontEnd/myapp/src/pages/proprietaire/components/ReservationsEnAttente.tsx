import React from "react";
import { useReservationsEnAttente } from "../hooks/useReservationsEnAttente";
import { FiArrowRightCircle, FiXCircle } from "react-icons/fi";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReservationsEnAttente: React.FC = () => {
    const { reservations, loading, updateStatut, userId } = useReservationsEnAttente();

    const handleUpdate = async (id: number, statut: string) => {
        try {
            await updateStatut(id, statut);
            console.log("ana hna ");
            toast.success(
                statut.toLowerCase() == "acceptée"
                    ? "Réservation acceptée avec succès."
                    : "Réservation annulée avec succès."
            );
        } catch (err) {
            toast.error("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    if (userId === null) {
        return <p className="text-center text-gray-500 mt-10">Chargement...</p>;
    }

    if (userId === 0) {
        return <p className="text-center text-gray-500 mt-10">Utilisateur non identifié.</p>;
    }

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Chargement des réservations...</p>;
    }

    return (
        <>
        <div className="max-w-5xl mx-auto px-6 py-16 mt-16">
            <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">Réservations en attente</h1>

            {reservations.length === 0 ? (
                <p className="text-center text-gray-500 text-base">Aucune réservation en attente.</p>
            ) : (
                <div className="space-y-8">
                    {reservations.map((res) => (
                        <div
                            key={res.id_reservation}
                            className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-6 gap-6"
                        >
                            <img
                                src={`data:image/jpeg;base64,${res.images}`}
                                alt={res.logementDescription}
                                className="w-full md:w-56 h-40 object-cover rounded-xl shadow-sm"
                            />

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {res.logementDescription} — {res.logementVille}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1 mb-4">
                                        Du <strong>{res.date_debut}</strong> au <strong>{res.date_fin}</strong>
                                    </p>

                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><strong>Locataire :</strong> {res.nom_locataire}</p>
                                        <p><strong>Email :</strong> <span className="break-all">{res.email_locataire}</span></p>
                                    </div>

                                    <span
                                        className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium ${
                                            res.statut === "En attente"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : res.statut === "Acceptée"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        Statut : {res.statut}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 ml-auto mr-4 mt-8">
                                <button
                                    className="inline-block bg-[#0077B6] hover:bg-[#005f91] text-white px-6 py-2.5 rounded-full flex items-center gap-2 text-base shadow transition duration-200"
                                    onClick={() => handleUpdate(res.id_reservation, "Acceptée")}
                                >
                                    <FiArrowRightCircle size={16} />
                                    Accepter
                                </button>

                                {res.statut === "En attente" && (
                                    <button
                                        className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2 text-base shadow transition duration-200"
                                        onClick={() => handleUpdate(res.id_reservation, "Refusée")}
                                    >
                                        <FiXCircle size={16} />
                                        Refuser
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
};

export default ReservationsEnAttente;
