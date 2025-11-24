import { useState } from "react";
import { z } from "zod";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { toast } from "react-toastify";
import { useCreateLogement } from "../hooks/useCreateLogement";
import { useCategories } from "../hooks/useCategories";
import { useEquipementsByCategorie } from "../hooks/useEquipementsByCategorie";
import { DispoCalendarRange } from "../../../components/DispoCalendarRange";
const schema = z.object({
    surface: z.string().min(1, { message: "La surface est requise" }),
    type_log: z.string().min(1, { message: "Le type de logement est requis" }),
    description: z.string().min(1, { message: "La description est requise" }),
    prix: z.string().min(1, { message: "Le prix est requis" }),
    ville: z.string().min(1, { message: "La ville est requise" }),
    justificatif_domicile: z.instanceof(File, { message: "Le justificatif est requis" }),
    images: z.array(z.instanceof(File)).min(1, { message: "Au moins une image est requise" }),
    date_dispo_debut: z.string().min(1, { message: "Date de début requise" }),
    date_dispo_fin: z.string().min(1, { message: "Date de fin requise" }),
    id_categorie: z.string().min(1, { message: "Catégorie requise" }),
    ids_equipements: z.array(z.string()).min(1, { message: "Équipements requis" })
});

type Props = {
    isOpen: boolean;
    onClose: () => void;
};
function toISODateWithoutTZ(date: Date): string {
    const corrected = new Date(date);
    corrected.setHours(12, 0, 0, 0); 
    return corrected.toISOString().split("T")[0]; 
}
export const AjoutLogementModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { mutate: createLogement } = useCreateLogement();
    const { data: categories = [] } = useCategories();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [form, setForm] = useState({
        surface: "",
        type_log: "",
        description: "",
        prix: "",
        ville: "",
        justificatif_domicile: null as File | null,
        images: [] as File[],
        date_dispo_debut: "",
        date_dispo_fin: "",
        id_categorie: "",
        ids_equipements: [] as string[]
    });

    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });

    const { data: equipements = [] } = useEquipementsByCategorie(form.id_categorie);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "justificatif_domicile" | "images"
    ) => {
        const files = e.target.files;
        if (!files) return;

        if (field === "justificatif_domicile") {
            setForm({ ...form, justificatif_domicile: files[0] });
        } else {
            setForm({ ...form, images: Array.from(files) });
        }
    };

    const handleEquipementToggle = (id: string) => {
        setForm(prev => {
            const alreadySelected = prev.ids_equipements.includes(id);
            return {
                ...prev,
                ids_equipements: alreadySelected
                    ? prev.ids_equipements.filter(eid => eid !== id)
                    : [...prev.ids_equipements, id]
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (dateRange.start && dateRange.end) {
            form.date_dispo_debut = toISODateWithoutTZ(dateRange.start);
            form.date_dispo_fin = toISODateWithoutTZ(dateRange.end);
        }

        const id_utilisateur = localStorage.getItem("userId");
        if (!id_utilisateur) {
            toast.error("Erreur d'authentification : ID utilisateur manquant.");
            return;
        }

        const result = schema.safeParse(form);
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.errors.forEach(err => {
                if (err.path.length > 0) formattedErrors[err.path[0]] = err.message;
            });
            setErrors(formattedErrors);
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "images") {
                (value as File[]).forEach(file => formData.append("Image", file));
            } else if (key === "justificatif_domicile") {
                formData.append("Justificatif_domicile", value as File);
            } else if (key === "ids_equipements") {
                (value as string[]).forEach(id => formData.append("ids_equipements", id));
            } else {
                formData.append(key, value as string);
            }
        });
        formData.append("id_utilisateur", id_utilisateur);

        createLogement(formData, {
            onSuccess: () => {
                toast.success("Logement ajouté avec succès !");
                onClose();
            },
            onError: () => toast.error("Erreur lors de l'ajout du logement")
        });
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
                    <h2 className="text-2xl font-medium text-[#1B1B1B] text-center">Commencer sur HomeAway, c'est facile</h2>
                    <p className="text-center text-gray-500 mt-2">Parlez-nous de votre logement</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-[#F7F9FA] rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-[#1B1B1B] mb-4">INFORMATIONS DE BASE</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                id="type_log"
                                name="type_log"
                                label="Type de logement"
                                value={form.type_log}
                                onChange={handleChange}
                                errorMessage={errors.type_log}
                                required
                                placeholder="Ex: Appartement"
                                className="bg-white border-[#E1E5E8] focus:border-[#0084FF] rounded-lg"
                            />
                            <Input
                                id="prix"
                                name="prix"
                                label="Prix"
                                type="number"
                                value={form.prix}
                                onChange={handleChange}
                                errorMessage={errors.prix}
                                required
                                placeholder="Ex: 950"
                                className="bg-white border-[#E1E5E8] focus:border-[#0084FF] rounded-lg"
                            />
                            <Input
                                id="surface"
                                name="surface"
                                label="Surface"
                                type="number"
                                value={form.surface}
                                onChange={handleChange}
                                errorMessage={errors.surface}
                                required
                                placeholder="m²"
                                className="bg-white border-[#E1E5E8] focus:border-[#0084FF] rounded-lg"
                            />
                            <Input
                                id="ville"
                                name="ville"
                                label="Ville"
                                value={form.ville}
                                onChange={handleChange}
                                errorMessage={errors.ville}
                                required
                                placeholder="Ex: Amiens"
                                className="bg-white border-[#E1E5E8] focus:border-[#0084FF] rounded-lg"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Décrivez brièvement votre logement"
                                className="w-full p-3 bg-white border border-[#E1E5E8] rounded-lg focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] min-h-[120px]"
                                required
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((c) => {
                                    const isSelected = form.id_categorie === c.id_categorie.toString();

                                    return (
                                        <button
                                            key={c.id_categorie}
                                            type="button"
                                            onClick={() => setForm({...form, id_categorie: c.id_categorie.toString()})}
                                            className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm 
                        ${isSelected
                                                ? 'bg-[#0084FF] text-white border-[#0084FF]'
                                                : 'bg-white text-gray-800 border-gray-300 hover:border-[#0084FF]'}`}
                                        >
                                            {c.nom_categorie}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.id_categorie && <p className="text-red-500 text-sm mt-2">{errors.id_categorie}</p>}
                        </div>

                    </div>

                    {equipements.length > 0 && (
                        <div className="bg-[#F7F9FA] rounded-lg p-6">
                            <h3 className="text-lg font-medium text-[#1B1B1B] mb-4">SERVICES PUBLICS</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {equipements.map(e => (
                                    <label key={e.id_equipement}
                                           className="flex items-center space-x-3 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            value={e.id_equipement}
                                            checked={form.ids_equipements.includes(e.id_equipement.toString())}
                                            onChange={() => handleEquipementToggle(e.id_equipement.toString())}
                                            className="w-4 h-4 text-[#0084FF] border-gray-300 rounded focus:ring-[#0084FF]"
                                        />
                                        <span>{e.nom_equipement}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-[#F7F9FA] rounded-lg p-6">
                        <h3 className="text-lg font-medium text-[#1B1B1B] mb-4">IMAGES ET DOCUMENTS</h3>
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
                                        required
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
                                        required
                                        className="hidden"
                                    />
                                </label>
                            </div>

                        </div>
                    </div>

                    <div className="bg-[#F7F9FA] rounded-lg p-6">
                        <h3 className="text-lg font-medium text-[#1B1B1B] mb-4">VOS DISPONIBILITÉS</h3>

                        <div className="grid grid-cols-1">
                            <DispoCalendarRange
                                dateRange={dateRange}
                                onDateChange={(range) => {
                                    setDateRange(range);
                                }}
                            />
                            {errors.date_dispo_debut && (
                                <p className="text-red-500 text-sm mt-2">{errors.date_dispo_debut}</p>
                            )}
                        </div>
                    </div>


                    <div className="pt-6">
                        <Button type="submit"
                                className="w-full bg-[#0084FF] hover:bg-[#0066CC] text-white py-4 rounded-lg text-lg font-medium transition-colors">
                            Soumettre
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
