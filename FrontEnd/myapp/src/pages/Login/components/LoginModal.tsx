import { useState } from "react";
import { z } from "zod";
import { Modal } from "../../../components/Modal";
import { toast } from "react-toastify";
import { Mail, Lock, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
const schema = z.object({
    email: z.string().email({ message: "Email invalide" }),
    mot_de_passe: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string, mot_de_passe: string) => Promise<boolean>;
};
export const LoginModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        email: "",
        mot_de_passe: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const validateForm = () => {
        const result = schema.safeParse(form);
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path.length > 0) formattedErrors[err.path[0]] = err.message;
            });
            setErrors(formattedErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const success = await onSubmit(form.email, form.mot_de_passe);
        if (success) {
            toast.success("Connexion réussie !");
            setForm({ email: "", mot_de_passe: "" });
            onClose();
        } else {
            toast.error("Email ou mot de passe incorrect !");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Se connecter</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Adresse e-mail"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Mot de passe */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="mot_de_passe"
                            placeholder="Mot de passe"
                            value={form.mot_de_passe}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        {errors.mot_de_passe && (
                            <p className="text-sm text-red-500 mt-1">{errors.mot_de_passe}</p>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition duration-200"
                    >
                        Se connecter
                    </button>
                    
                    <p className="text-center text-sm text-gray-500">
                        Vous n'avez pas encore de compte ?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            S'inscrire
                        </Link>
                    </p>
                </form>
                
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-3 text-gray-500 text-sm">ou</span>
                    <hr className="flex-grow border-gray-300" />
                </div>
                
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-between border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition">
                        <span className="text-sm text-gray-700">Connecter avec Facebook</span>
                        <Facebook className="text-blue-600" />
                    </button>

                    <button className="w-full flex items-center justify-between border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition">
                        <span className="text-sm text-gray-700">Connecter avec Google</span>
                        <FcGoogle size={20} />
                    </button>
                </div>
            </div>
        </Modal>
    );
};
