import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRequestById } from "../hooks/UseRequestsById.tsx";
import AdminNavbar from "../../../components/AdminNavbar.tsx";
import { FiCheck, FiX } from "react-icons/fi";
const RequestDemande: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { request, loading, fetchRequestById, updateRequestStatus } = useRequestById();
    useEffect(() => {
        if (id) fetchRequestById(Number(id));
    }, [id]);

    console.log(request);
    if (loading)
        return <p className="text-center text-gray-500 mt-10">Chargement...</p>;

    if (!request)
        return <p className="text-center text-red-500 mt-10">Aucune demande trouvée.</p>;

    const handleStatusChange = (status: string) => {
        if (id) updateRequestStatus(Number(id), status);
    };

    return (
        <>
            <AdminNavbar />
            <div className="w-screen h-screen flex justify-center items-center bg-gray-100 pt-20">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                    <h2 className="text-3xl font-bold text-center text-blue-600 uppercase mb-6">
                        Détails de la Demande
                    </h2>

                    {/* Infos Utilisateur (depuis la demande) */}
                    <div className="border rounded-lg shadow p-6 mb-6 bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Informations Utilisateur</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-700">Email:</span>
                                <span className="text-gray-900">{request.email}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700">Rôle(s) actuel(s):</span>
                                <div className="text-gray-900 text-right">
                                    {request.rolesActuels.length > 0 ? (
                                        request.rolesActuels.map((role, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full mr-2"
                                            >
                                                {role}
                                            </span>
                                        ))
                                    ) : (
                                        <span>Aucun rôle trouvé</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Infos Demande */}
                    <div className="border rounded-lg shadow p-6 bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Informations de la Demande</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-700">ID:</span>
                                <span className="text-gray-900">{request.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-700">Motif:</span>
                                <span className="text-gray-900">{request.motif}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-700">Statut:</span>
                                <span
                                    className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                                        request.statut === "acceptée"
                                            ? "bg-green-100 text-green-600"
                                            : request.statut === "rejetée"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-yellow-100 text-yellow-600"
                                    }`}
                                >
                                    {request.statut}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Boutons */}
                    {request.statut === "En attente" && (
                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
                                onClick={() => handleStatusChange("Acceptée")}
                            >
                                <FiCheck /> Accepter
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                                onClick={() => handleStatusChange("Refusée")}
                            >
                                <FiX /> Rejeter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default RequestDemande;
