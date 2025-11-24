
import { useState, useEffect } from "react";
import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { useUserActions } from "../hooks/useUserActions";
import { toast } from "react-toastify";
export type User = {
    id: string;
    Nom: string;
    Prenom: string;
    Email: string;
    Num_phone: string;
    Sexe: string;
    Ville: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onUserUpdated: () => void;
};

const UserModal: React.FC<Props> = ({ isOpen, onClose, user, onUserUpdated }) => {
    const { updateUser } = useUserActions();
    const [formData, setFormData] = useState({
        Nom: "",
        Prenom: "",
        Email: "",
        Num_phone: "",
        Sexe: "",
        Ville: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                Nom: user.Nom || "",
                Prenom: user.Prenom || "",
                Email: user.Email || "",
                Num_phone: user.Num_phone || "",
                Sexe: user.Sexe || "",
                Ville: user.Ville || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.Nom.trim()) {
            toast.error("Le champ 'Nom' est requis !");
            setLoading(false);
            return;
        }

        const success = await updateUser(user.id, formData);
        if (success) {
            toast.success("Compte mis à jour avec succès !");
            onUserUpdated();
            onClose();
        } else {
            toast.error("Erreur lors de la mise à jour !");
        }

        setLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Modifier le compte</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input id="Nom" name="Nom" label="Nom" value={formData.Nom} onChange={handleChange} required />
                    <Input id="Prenom" name="Prenom" label="Prénom" value={formData.Prenom} onChange={handleChange} required />
                    <Input id="Email" name="Email" label="Email" value={formData.Email} onChange={handleChange} type="email" required />
                    <Input id="Num_phone" name="Num_phone" label="Téléphone" value={formData.Num_phone} onChange={handleChange} required />
                    <Input id="Ville" name="Ville" label="Ville" value={formData.Ville} onChange={handleChange} required />

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            className="w-1/2 bg-red-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mr-2"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md ml-2"
                            disabled={loading}
                        >
                            {loading ? "Modification..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UserModal;
