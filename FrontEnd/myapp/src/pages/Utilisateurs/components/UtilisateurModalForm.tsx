import { useState } from "react";
import { z } from "zod";
import { Modal } from "../../../components/Modal";
import { InputSelect } from "../../../components/InputSelect";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {useCreateUtilisateur} from "../hooks/useUtilisateursProvider.tsx";

const schema = z.object({
    nom: z.string().min(1, { message: "Le nom est requis" }),
    prenom: z.string().min(1, { message: "Le prénom est requis" }),
    num_phone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
    ville: z.string().min(1, { message: "La ville est requise" }),
    sexe: z.enum(["Homme", "Femme"], { message: "Sélectionnez un sexe" }),
    email: z.string().email({ message: "Email invalide" }),
    mot_de_passe: z.string().min(6, { message: "Mot de passe trop court" }),
});

type Props = {
    isOpen: boolean;
    onClose: () => void;
};
export const UtilisateurModalForm: React.FC<Props> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        num_phone: "",
        ville: "",
        sexe: "",
        email: "",
        mot_de_passe: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const result = schema.safeParse(form);
        if (!result.success) {
            setErrors(
                result.error.errors.reduce((acc, err) => {
                    if (err.path.length > 0) acc[err.path[0]] = err.message;
                    return acc;
                }, {} as Record<string, string>)
            );
            return false;
        }
        setErrors({});
        return true;
    };
    const { mutate: createUtilisateur } = useCreateUtilisateur();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        createUtilisateur(form, {
            onSuccess: () => {
                toast.success("Compte créé avec succès !");
                setForm({ nom: "", prenom: "", num_phone: "", ville: "", sexe: "", email: "", mot_de_passe: "" });
                onClose();
                navigate("/");
            },
            onError: () => {
                toast.error("Erreur lors de l'inscription");
            },
        });
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-xl w-[40rem] mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Créer un compte</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nom & Prénom */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="nom"
                            name="nom"
                            label="Nom"
                            value={form.nom}
                            onChange={handleChange}
                            errorMessage={errors.nom}
                            required
                            placeholder="Entrez votre nom"
                            className="border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Input
                            id="prenom"
                            name="prenom"
                            label="Prénom"
                            value={form.prenom}
                            onChange={handleChange}
                            errorMessage={errors.prenom}
                            required
                            placeholder="Entrez votre prénom"
                            className="border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="num_phone"
                            name="num_phone"
                            label="Téléphone"
                            value={form.num_phone}
                            onChange={handleChange}
                            errorMessage={errors.num_phone}
                            required
                            placeholder="Entrez votre numéro de téléphone"
                            className="border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Input
                            id="ville"
                            name="ville"
                            label="Ville"
                            value={form.ville}
                            onChange={handleChange}
                            errorMessage={errors.ville}
                            required
                            placeholder="Entrez votre ville"
                            className="border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <InputSelect
                            id="sexe"
                            name="sexe"
                            label="Sexe"
                            options={[
                                {label: "Sélectionnez votre sexe", value: ""},
                                {label: "Homme", value: "Homme"},
                                {label: "Femme", value: "Femme"}
                            ]}
                            value={form.sexe}
                            onChange={handleChange}
                            errorMessage={errors.sexe}
                            required
                            className="border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            value={form.email}
                            onChange={handleChange}
                            errorMessage={errors.email}
                            required
                            placeholder="Entrez votre email"
                            className="border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <Input
                            id="mot_de_passe"
                            name="mot_de_passe"
                            type="password"
                            label="Mot de passe"
                            value={form.mot_de_passe}
                            onChange={handleChange}
                            errorMessage={errors.mot_de_passe}
                            required
                            placeholder="Entrez votre mot de passe"
                            className="border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Bouton */}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-transform transform hover:scale-105"
                    >
                        S'inscrire
                    </Button>
                </form>
                <p className="text-sm text-center text-gray-500 mt-4">
                    Vous avez déjà un compte ?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
                </p>

            </div>
        </Modal>
    );

};