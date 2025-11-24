import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLogementById } from "../hooks/useLogementById";
import { useEquipements } from "../hooks/useEquipements";
import { FaWifi, FaRadiation, FaCoffee, FaBed } from "react-icons/fa"; // Importation des icônes
import { ReservationForm } from "../ui/ReservationForm.tsx";
export const LogementDetails = () => {
    const { id } = useParams();
    const { data: logement, isLoading, isError } = useQuery({
        queryKey: ["logement", id],
        queryFn: () => fetchLogementById(id!),
        enabled: !!id,
    });
    const { data: equipements, isLoading: isEquipementsLoading, isError: isEquipementsError } = useEquipements(parseInt(id!));

    useEffect(() => {
        console.log("Logement:", logement);
        console.log("Equipements:", equipements);
    }, [logement, equipements]);
    if (isLoading || isEquipementsLoading) return <p className="text-center mt-10 text-black">Chargement du logement...</p>;
    if (isError || isEquipementsError || !logement) return <p className="text-center mt-10 text-red-500">Erreur ou logement introuvable</p>;
    const equipementsUtiles = equipements?.length
        ? equipements.filter((eq) =>
            logement?.ids_equipements?.includes(eq.id_equipement)  // Filtrage par ID
        )
        : [];
    const getEquipementIcon = (nom: string) => {
        switch (nom.toLowerCase()) {
            case "wifi":
                return <FaWifi className="text-blue-500" />;
            case "chauffage":
                return <FaRadiation className="text-red-500" />;
            case "coffee":
                return <FaCoffee className="text-brown-500" />;
            case "lit":
                return <FaBed className="text-gray-500" />;
            default:
                return <span></span>;
        }
    };

    return (
        <div className="p-6 md:p-10 bg-gray-100 min-h-screen text-black font-sans mt-20">
            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
                <img
                    src={`data:image/jpeg;base64,${logement.imageBytes}`}
                    alt="Image principale"
                    className="col-span-2 h-96 object-cover rounded-xl"
                />
                <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                        <img
                            key={i}
                            src={`data:image/jpeg;base64,${logement.imageBytes}`}
                            className="h-44 w-full object-cover rounded-xl"
                            alt={`Image secondaire ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Titre */}
            <h1 className="text-xl font-semibold mb-2">
                {logement.description}, {logement.ville}
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Infos logement */}
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="font-bold mb-2">Infos sur la chambre</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div><span className="text-xs text-gray-500">TARIFS</span><br />{logement.prix} euros</div>
                            <div><span className="text-xs text-gray-500">SUPERFICIE</span><br />{logement.surface} m²</div>
                            <div><span className="text-xs text-gray-500">CAPACITÉ</span><br />{logement.capacite ?? "3 max"}</div>
                            <div><span className="text-xs text-gray-500">STATUT</span><br /><span className="text-green-600 font-semibold">Chambre disponible</span></div>
                        </div>
                    </div>

                    {/* Utilitaires */}
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="font-bold mb-2">🧰 Utilitaires</p>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                            {equipementsUtiles.length > 0 ? (
                                equipementsUtiles.map((eq) => (
                                    <div key={eq.id_equipement} className="flex items-center gap-1">
                                        {getEquipementIcon(eq.nom_equipement)} {/* Affichage de l'icône */}
                                        <span>{eq.nom_equipement}</span>
                                        <span className="text-xs text-gray-500">({eq.id_categorie})</span>
                                    </div>
                                ))
                            ) : (
                                <p>Aucun équipement disponible</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="font-bold mb-2">📝 Description</p>
                        <p className="text-sm whitespace-pre-line">{logement.description_longue ?? logement.description}</p>
                    </div>
                </div>

                {/* Colonne droite */}
                <div className="space-y-4">


                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-xl font-bold mb-2">{logement.prix}€/nuit</p>
                        <ReservationForm logementId={logement.id} prix={logement.prix} />
                    </div>
                </div>
            </div>

        </div>
    );
};