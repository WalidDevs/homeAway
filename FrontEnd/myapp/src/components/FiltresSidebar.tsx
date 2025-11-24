import { useState } from "react";
import { CalendarDays, Layers, Ruler, Euro, Filter } from "lucide-react";

const equipementsDisponibles = [
    { id: 1, nom: "Four" },
    { id: 2, nom: "Plaques de cuisson" },
    { id: 3, nom: "Réfrigérateur" },
    { id: 4, nom: "Lave-vaisselle" },
    { id: 5, nom: "Micro-ondes" },
    { id: 6, nom: "Télévision" }
];

type Props = {
    onFilterChange: (filters: {
        ville?: string;
        type_log?: string;
        statut_logement: string;
        prixMin?: number;
        prixMax?: number;
        surfaceMin?: number;
        surfaceMax?: number;
        dateDebut?: string;
        dateFin?: string;
        motCle?: string;
        idsEquipements?: number[];
    }) => void;
};

export default function FiltresSidebar({ onFilterChange }: Props) {
    const [typeLog, setTypeLog] = useState("");
    const [prixMin, setPrixMin] = useState("");
    const [prixMax, setPrixMax] = useState("");
    const [surfaceMin, setSurfaceMin] = useState("");
    const [surfaceMax, setSurfaceMax] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [idsEquipements, setIdsEquipements] = useState<number[]>([]);

    const toggleEquipement = (id: number) => {
        setIdsEquipements((prev) =>
            prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({
            type_log: typeLog,
            statut_logement: "En attente",
            prixMin: prixMin ? parseInt(prixMin) : undefined,
            prixMax: prixMax ? parseInt(prixMax) : undefined,
            surfaceMin: surfaceMin ? parseInt(surfaceMin) : undefined,
            surfaceMax: surfaceMax ? parseInt(surfaceMax) : undefined,
            dateDebut: dateDebut || undefined,
            dateFin: dateFin || undefined,
            idsEquipements: idsEquipements.length ? idsEquipements : undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 w-72 bg-white border-r border-gray-200 rounded-xl shadow-md">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <Filter className="w-5 h-5" /> Filtres
            </h2>
            
            <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                    <Layers size={16} /> Type de logement
                </label>
                <select
                    value={typeLog}
                    onChange={(e) => setTypeLog(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Tous les types</option>
                    <option value="Appartement">Appartement</option>
                    <option value="Maison">Maison</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                </select>
            </div>
            
            <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                    <Euro size={16} /> Prix (€)
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={prixMin}
                        onChange={(e) => setPrixMin(e.target.value)}
                        className="border p-2 rounded text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={prixMax}
                        onChange={(e) => setPrixMax(e.target.value)}
                        className="border p-2 rounded text-sm"
                    />
                </div>
            </div>
            
            <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                    <Ruler size={16} /> Surface (m²)
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={surfaceMin}
                        onChange={(e) => setSurfaceMin(e.target.value)}
                        className="border p-2 rounded text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={surfaceMax}
                        onChange={(e) => setSurfaceMax(e.target.value)}
                        className="border p-2 rounded text-sm"
                    />
                </div>
            </div>
            
            <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                    <CalendarDays size={16} /> Date de début
                </label>
                <input
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="w-full border p-2 rounded text-sm"
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                    <CalendarDays size={16} /> Date de fin
                </label>
                <input
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="w-full border p-2 rounded text-sm"
                />
            </div>
            
            <div>
                <p className="font-semibold text-gray-700 text-sm mb-2">Équipements</p>
                <div className="space-y-2">
                    {equipementsDisponibles.map((e) => (
                        <label key={e.id} className="flex items-center text-sm gap-2 text-gray-700">
                            <input
                                type="checkbox"
                                checked={idsEquipements.includes(e.id)}
                                onChange={() => toggleEquipement(e.id)}
                                className="rounded border-gray-300 focus:ring-blue-500"
                            />
                            {e.nom}
                        </label>
                    ))}
                </div>
            </div>
            
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
            >
                Appliquer
            </button>
        </form>
    );
}
