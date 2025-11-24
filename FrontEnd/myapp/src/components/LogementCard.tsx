import { Eye, MapPin, Ruler, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Logement = {
    id_logement: number;
    type_log: string;
    ville: string;
    description: string;
    prix: number;
    surface?: number;
    image?: string;
};

type Props = {
    logement: Logement;
};

const LogementCard: React.FC<Props> = ({ logement }) => {
    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/logement/${logement.id_logement}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border">
            <div className="relative w-full h-40 bg-gray-100">
                {logement.image ? (
                    <img
                        src={`data:image/png;base64,${logement.image}`}
                        alt={logement.description}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">Pas d'image</div>
                )}
                <button
                    onClick={handleView}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
                    title="Voir les détails"
                >
                    <Eye size={18} className="text-gray-600" />
                </button>
            </div>

            <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                        <Home size={16} /> {logement.type_log}
                    </h3>
                    <span className="text-cyan-600 font-bold text-md flex items-center gap-1">
                         {logement.prix}€
                    </span>
                </div>

                <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} /> {logement.ville}
                </p>

                <p className="text-sm text-gray-700 line-clamp-2">{logement.description}</p>

                {logement.surface && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Ruler size={14} /> {logement.surface} m²
                    </p>
                )}
            </div>
        </div>
    );
};

export default LogementCard;
