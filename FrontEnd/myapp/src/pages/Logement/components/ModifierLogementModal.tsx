import { useState, useEffect } from "react";
import { Modal} from "../../../components/Modal.tsx";
import { Button} from "../../../components/Button.tsx";
import { Input} from "../../../components/Input.tsx";
import { Logement} from "../types/logementTypes.tsx";
import { useUpdateLogement} from "../hooks/useUpdateLogement.tsx";
import { useCategories} from "../hooks/useCategories.tsx";
import { useEquipementsByCategorie} from "../hooks/useEquipementsByCategorie.tsx";
import { z } from "zod";
import { toast } from "react-toastify";
import { DispoCalendarRange } from "../../../components/DispoCalendarRange";

const schema = z.object({
    surface: z.string().min(1),
    type_log: z.string().min(1),
    description: z.string().min(1),
    prix: z.string().min(1),
    ville: z.string().min(1),
    date_dispo_debut: z.string().min(1),
    date_dispo_fin: z.string().min(1),
    ids_equipements: z.array(z.string()).min(1, { message: "Equipements requis" })
});

function toISODate(date: Date): string {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0);
    return d.toISOString().split("T")[0];
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    logement: Logement;
};

export const ModifierLogementModal: React.FC<Props> = ({ isOpen, onClose, logement }) => {
    const userId = localStorage.getItem("userId") ?? "";
    const { mutate: updateLogement } = useUpdateLogement(userId);
    const [form, setForm] = useState({
        surface: "",
        type_log: "",
        description: "",
        prix: "",
        ville: "",
        date_dispo_debut: "",
        date_dispo_fin: "",
        justificatif_domicile: null as File | null,
        images: [] as File[],
        id_categorie: 0,
        ids_equipements: [] as string[]
    });
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { data: categories = [] } = useCategories();
    const { data: equipements = [] } = useEquipementsByCategorie(form.id_categorie.toString());
    useEffect(() => {
        if (!logement) return;

        const start = logement.date_dispo_debut ? new Date(logement.date_dispo_debut) : null;
        const end = logement.date_dispo_fin ? new Date(logement.date_dispo_fin) : null;
        setDateRange({ start, end });
        setForm({
            surface: logement.surface?.toString() ?? "",
            type_log: logement.type_log,
            description: logement.description,
            prix: logement.prix.toString(),
            ville: logement.ville,
            date_dispo_debut: logement.date_dispo_debut?.split("T")[0] ?? "",
            date_dispo_fin: logement.date_dispo_fin?.split("T")[0] ?? "",
            justificatif_domicile: null,
            images: [],
            id_categorie: Number(logement.id_categorie) || 0,
            ids_equipements: logement.ids_equipements?.map(String) ?? []
        });
    }, [logement]);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "justificatif_domicile" | "images"
    ) => {
        const files = e.target.files;
        if (!files) return;
        setForm(prev => ({
            ...prev,
            [field]: field === "images" ? Array.from(files) : files[0]
        }));
    };
    const handleEquipementToggle = (id: string) => {
        setForm(prev => ({
            ...prev,
            ids_equipements: prev.ids_equipements.includes(id)
                ? prev.ids_equipements.filter(e => e !== id)
                : [...prev.ids_equipements, id]
        }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return toast.error("Utilisateur non authentifié");
        if (dateRange.start && dateRange.end) {
            form.date_dispo_debut = toISODate(dateRange.start);
            form.date_dispo_fin = toISODate(dateRange.end);
        }
        const result = schema.safeParse(form);
        if (!result.success) {
            const formatted: Record<string, string> = {};
            result.error.errors.forEach(err => {
                if (err.path[0]) formatted[err.path[0]] = err.message;
            });
            setErrors(formatted);
            return;
        }
        const formData = new FormData();
        formData.append("Surface", form.surface);
        formData.append("Type_log", form.type_log);
        formData.append("Description", form.description);
        formData.append("Prix", form.prix);
        formData.append("Ville", form.ville);
        formData.append("Date_dispo_debut", new Date(form.date_dispo_debut).toISOString());
        formData.append("Date_dispo_fin", new Date(form.date_dispo_fin).toISOString());
        formData.append("Id_utilisateur", userId);
        formData.append("Id_categorie", form.id_categorie.toString());
        form.ids_equipements.forEach(id => {
            formData.append("Ids_equipements", id);
        });
        if (form.justificatif_domicile)
            formData.append("Justificatif_domicile", form.justificatif_domicile);
        form.images.forEach(img => {
            formData.append("Image", img);
        });
        updateLogement(
            { id: logement.id, formData },
            {
                onSuccess: () => {
                    toast.success("Logement modifié avec succès !");
                    onClose();
                },
                onError: () => toast.error("Erreur lors de la modification du logement")
            }
        );
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white rounded-xl max-h-[90vh] overflow-y-auto w-full sm:w-[45rem] p-8 shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl font-bold z-10"
                    aria-label="Fermer"
                >
                    &times;
                </button>
                <div className="border-b border-gray-100 pb-6 mb-6">
                    <h2 className="text-2xl font-medium text-[#1B1B1B] text-center">Modifier votre logement</h2>
                    <p className="text-center text-gray-500 mt-2">Mettez à jour les informations ci-dessous</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-[#F7F9FA] rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-[#1B1B1B] mb-4">INFORMATIONS DE BASE</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <Input id="type_log" name="type_log" label="Type de logement" value={form.type_log}
                                   onChange={handleChange} errorMessage={errors.type_log} required/>
                            <Input id="prix" name="prix" label="Prix" type="number" value={form.prix}
                                   onChange={handleChange} errorMessage={errors.prix} required/>
                            <Input id="surface" name="surface" label="Surface" type="number" value={form.surface}
                                   onChange={handleChange} errorMessage={errors.surface} required/>
                            <Input id="ville" name="ville" label="Ville" value={form.ville} onChange={handleChange}
                                   errorMessage={errors.ville} required/>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange}
                                      className="w-full p-3 bg-white border border-[#E1E5E8] rounded-lg focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] min-h-[120px]"
                                      required/>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((c) => {
                                    const isSelected = Number(form.id_categorie) === c.id_categorie;
                                    return (
                                        <button
                                            key={c.id_categorie}
                                            type="button"
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    id_categorie: c.id_categorie,
                                                }))
                                            }
                                            className={`px-4 py-2 rounded-full border text-sm transition-all 
                                        ${
                                                isSelected
                                                    ? 'bg-[#0084FF] text-white border-[#0084FF]'
                                                    : 'bg-white text-gray-800 border-gray-300 hover:border-[#0084FF]'
                                            }`}
                                        >
                                            {c.nom_categorie}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {equipements.length > 0 && (
                        <div className="bg-[#F7F9FA] rounded-lg p-6">
                            <h3 className="text-lg font-medium text-[#1B1B1B] mb-4">SERVICES PUBLICS</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {equipements.map(e => (
                                    <label key={e.id_equipement}
                                           className="flex items-center space-x-3 text-sm text-gray-700">
                                        <input type="checkbox" value={e.id_equipement}
                                               checked={form.ids_equipements.includes(e.id_equipement.toString())}
                                               onChange={() => handleEquipementToggle(e.id_equipement.toString())}
                                               className="w-4 h-4 text-[#0084FF] border-gray-300 rounded focus:ring-[#0084FF]"/>
                                        <span>{e.nom_equipement}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-[#F7F9FA] rounded-lg p-6">
                        <h3 className="text-lg font-medium text-[#1B1B1B] mb-4">DOCUMENTS</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Justificatif de
                                    domicile</label>
                                <label
                                    htmlFor="justificatif-upload"
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer p-6 text-gray-500 hover:border-[#0084FF] hover:text-[#0084FF] transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M7 16V4m0 0L3 8m4-4l4 4m5 12H5a2 2 0 01-2-2V10a2 2 0 012-2h3m10 4v6m0 0l-3-3m3 3l3-3"/>
                                    </svg>
                                    <span className="text-sm">Cliquez pour ajouter un justificatif</span>
                                    <input
                                        id="justificatif-upload"
                                        type="file"
                                        onChange={(e) => handleFileChange(e, "justificatif_domicile")}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                                <label
                                    htmlFor="images-upload"
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer p-6 text-gray-500 hover:border-[#0084FF] hover:text-[#0084FF] transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M3 16l4-4a4 4 0 015.657 0L17 16M13 12l3 3m0 0l3-3M5 16v4h14v-4"/>
                                    </svg>
                                    <span className="text-sm">Ajoutez une ou plusieurs images</span>
                                    <input
                                        id="images-upload"
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileChange(e, "images")}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#F7F9FA] rounded-lg p-6">
                        <h3 className="text-lg font-medium text-[#1B1B1B] mb-4">VOS DISPONIBILITÉS</h3>
                        <div className="grid grid-cols-2">
                            <DispoCalendarRange
                                dateRange={dateRange}
                                onDateChange={(range) => setDateRange(range)}
                            />
                            {errors.date_dispo_debut && (
                                <p className="text-red-500 text-sm mt-2">{errors.date_dispo_debut}</p>
                            )}
                        </div>
                    </div>
                    <div className="pt-6">
                        <Button type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-medium transition-colors">
                            Enregistrer les modifications
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};