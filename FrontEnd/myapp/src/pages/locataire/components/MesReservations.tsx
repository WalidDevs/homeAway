import React from "react";
import { useMesReservations } from "../hooks/useMesReservations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FiArrowRightCircle, FiXCircle} from "react-icons/fi";
import { MapPin, Mail } from "lucide-react";
import {useNavigate} from "react-router-dom";
const MesReservations: React.FC = () => {
    const { reservations, isLoading, annulerReservation } = useMesReservations();
    const navigate = useNavigate();

    const handleAnnulation = async (id: number) => {
        try {
            await annulerReservation.mutateAsync(id);
            toast.success("Réservation annulée avec succès !");
        } catch (error: any) {
            toast.error(error?.message || "Erreur inconnue.");
        }
    };
    const handleConsultation=( id:number )=>{
        navigate(`/logement/${id}`);
    }

    if (isLoading) {
        return <p className="text-center text-gray-500 mt-40">Chargement des réservations...</p>;
    }

    if (reservations.length === 0) {
        return <p className="text-center text-gray-500 mt-40">Aucune réservation en cours.</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 mt-20">
            <ToastContainer />
            <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Mes Réservations</h1>

            <div className="space-y-8 divide-y divide-gray-100">
                {reservations.map((res) => (
                    <div
                        key={res.id_reservation}
                        className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-500 ease-in-out"
                    >
                        <img
                            src={`data:image/jpeg;base64,${res.images}`}
                            alt={res.logementDescription}
                            className="w-full md:w-56 h-40 object-cover rounded-2xl shadow-sm"
                        />

                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        {res.logementDescription} — {res.logementVille}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Du <strong>{res.date_debut}</strong> au <strong>{res.date_fin}</strong>
                                    </p>
                                </div>
                            </div>

                            <div className="w-fit flex flex-col sm:flex-row flex-wrap items-start sm:items-center text-sm text-gray-600 gap-3 mb-3">
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} className="text-gray-500" />
                                    <span>{res.logementVille}</span>
                                </div>

                                <div className="hidden sm:block h-4 w-px bg-gray-300 mx-2" />

                                <div>
                                    <p>
                                        <strong>Locataire :</strong> <span className="font-medium">{res.nom_locataire}</span>
                                    </p>
                                    <div className="flex items-start gap-2">
                                        <Mail size={16} className="text-gray-400 mt-0.5" />
                                        <p className="text-gray-500 break-all">{res.email_locataire}</p>
                                    </div>
                                </div>
                            </div>

                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    res.statut === "En attente"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                            >
                                Statut : {res.statut}
                            </span>
                        </div>

                        {/* Nouvelle div pour les boutons empilés et alignés */}
                        <div className="flex flex-col gap-3 ml-auto mr-4 mt-8">
                            <button
                                className="inline-block bg-[#0077B6] hover:bg-[#005f91] text-white px-6 py-2.5 rounded-full flex items-center gap-2 text-base shadow transition duration-200"
                                onClick={() => handleConsultation(res.id_reservation)}
                                disabled={annulerReservation.isPending}
                            >
                                <FiArrowRightCircle size={16} />
                                Consulter
                            </button>
                            {res.statut === "En attente" && (
                                <button
                                    className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2 text-base shadow transition duration-200"
                                    onClick={() => handleAnnulation(res.id_reservation)}
                                    disabled={annulerReservation.isPending}
                                >
                                    <FiXCircle size={16} />
                                    {annulerReservation.isPending ? "Annulation..." : "Annuler"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MesReservations;