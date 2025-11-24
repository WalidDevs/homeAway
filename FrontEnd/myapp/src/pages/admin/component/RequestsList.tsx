import React from "react";
import { useRequests } from "../hooks/UseRequests";
import {FiCheck} from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
const RequestsList: React.FC = () => {
    const { requests, loading } = useRequests();
    const navigate = useNavigate();

    React.useEffect(() => {
        requests.forEach((request) => {
            console.log("Détails de la demande :", {
                id: request.id_demande,
                email: request.email_demande,
                motif: request.motif_demande,
                statut: request.statut_demande
            });
        });
    }, [requests]);

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Chargement des demandes...</p>;
    }

    return (
        <>
            <AdminNavbar />
            <div className="w-screen h-screen flex justify-center items-center bg-gray-100 pt-20">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                    <h2 className="text-3xl font-bold text-center text-blue-600 uppercase mb-6">
                        Liste des demandes
                    </h2>

                    {requests.length === 0 ? (
                        <p className="text-center text-gray-500">Aucune demande trouvée.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Motif</th>
                                <th className="p-3 border">Statut</th>
                                <th className="p-3 border">Choix</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map((request) => (
                                <tr key={request.id_demande} className="text-center border ">
                                    <td className="p-3 border text-black">
                                        {request.email_demande || "Non spécifié" }
                                    </td>
                                    <td className="p-3 border text-black">
                                        {request.motif_demande || "Aucun motif fourni"}
                                    </td>
                                    <td className="p-3 border font-semibold text-black">
                                        {request.statut_demande?.replace("atteinte", "attente") || "Inconnu"}
                                    </td>
                                    <td className="p-3 border flex justify-center gap-4">
                                        <button
                                            className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                                            onClick={() => navigate(`/admin/dashboard/demande/${request.id_demande}`)}
                                        >
                                            <FiCheck /> Voir la demande
                                        </button>

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default RequestsList;