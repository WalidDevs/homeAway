import React from "react";
import { useLogementsEnAttente } from "../hooks/useLogementsEnAttente";
import { FiCheck, FiX } from "react-icons/fi";
const LogementsEnAttente: React.FC = () => {
    const { logements, loading, updateStatut } = useLogementsEnAttente();

    if (loading) return <p className="text-center mt-10 text-gray-500">Chargement...</p>;

    return (

        <div className="w-full min-h-screen bg-white px-4 py-10 mt-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Logements en attente</h1>

            {logements.length === 0 ? (
                <p className="text-center text-gray-600">Aucun logement en attente.</p>
            ) : (
                <div className="max-w-6xl mx-auto flex flex-col gap-6">
                    {logements.map((logement) => (
                        <div
                            key={logement.id_logement}
                            className="w-full flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
                        >
                            <img
                                src={`data:image/jpeg;base64,${logement.imageBase64}`}
                                alt="Image logement"
                                className="w-full md:w-60 h-48 object-cover"
                            />

                            <div className="flex-1 px-6 py-4 w-full">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {logement.type_log} - {logement.ville}
                                </h2>
                                <p className="text-gray-600">{logement.description}</p>

                                <div className="text-sm text-gray-500 mt-2 space-y-1">
                                    <p><strong>Surface :</strong> {logement.surface} m²</p>
                                    <p><strong>Prix :</strong> {logement.prix} MAD</p>
                                    <p><strong>Statut :</strong> {logement.statut_logement}</p>
                                    <p><strong>Propriétaire :</strong> {logement.emailUtilisateur}</p>
                                </div>
                            </div>

                            <div className="flex md:flex-col gap-3 p-4 w-full md:w-auto justify-center">
                                <button
                                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition w-full"
                                    onClick={() => updateStatut(logement.id_logement, "Accepté")}
                                >
                                    <FiCheck /> Accepter
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition w-full"
                                    onClick={() => updateStatut(logement.id_logement, "Refusé")}
                                >
                                    <FiX /> Refuser
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LogementsEnAttente;
