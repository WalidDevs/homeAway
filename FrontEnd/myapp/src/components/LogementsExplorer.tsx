import { useSearchLogements, LogementFilters } from "../pages/Logement/hooks/useSearchLogements.tsx";
import LogementCard from "./LogementCard";
import FiltresSidebar from "./FiltresSidebar";
import { useState, useEffect } from "react";

type Props = {
    ville: string;
    motCle: string;
};

type Logement = {
    id_logement: number;
    type_log: string;
    ville: string;
    description: string;
    prix: number;
};

const LogementsExplorer: React.FC<Props> = ({ ville, motCle }) => {
    const [filters, setFilters] = useState<LogementFilters>({
        statut_logement: "En attente",
        ville,
        motCle,
    });
    
    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            ville,
            motCle,
        }));
    }, [ville, motCle]);

    const { data: logements = [], isLoading, isError } = useSearchLogements(filters);

    return (
        <div className="min-h-screen bg-gray-50 pt-0">
            <div className="flex">
                <FiltresSidebar onFilterChange={setFilters} />
                
                <div className="flex-1 p-6 space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Logements disponibles</h1>

                    {isLoading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {isError && (
                        <div className="text-red-500 text-center">Erreur lors du chargement</div>
                    )}

                    {!isLoading && logements.length === 0 && (
                        <div className="flex justify-center items-center h-96">
                            <div className="bg-white shadow-md rounded-lg p-10 text-center max-w-md">
                                <div className="text-5xl mb-4 text-gray-400">🏠</div>
                                <h2 className="text-xl font-semibold text-gray-700">Aucun logement trouvé</h2>
                                <p className="text-gray-500 mt-2">Essayez d’élargir vos filtres ou de changer de ville.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {logements.map((logement: Logement) => (
                            <LogementCard key={logement.id_logement} logement={logement} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogementsExplorer;
