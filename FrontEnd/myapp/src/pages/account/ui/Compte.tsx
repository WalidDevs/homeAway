import React, { useState } from "react";
import { useAuth } from "../../Login/hooks/useAuth.tsx";
import UserModal from "../component/UserModal.tsx";
import { useUserActions } from "../hooks/useUserActions";
import { FiEdit, FiTrash, FiUserCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
const Compte: React.FC = () => {
    const { user, logout } = useAuth();
    const { deleteUser } = useUserActions();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const navigate = useNavigate();
    if (!user) return <p></p>;
    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer votre compte ?")) {
            const success = await deleteUser(user.id);
            if (success) {
                toast.success("Compte supprimé avec succès !");
                logout();
            } else {
                toast.error("Erreur lors de la suppression du compte !");
            }
        }
    };

    return (
        <>


            <div className="w-screen h-screen flex justify-center items-center bg-gray-100 pt-20">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                    <h2 className="text-2xl font-bold text-center text-blue-600 uppercase mb-6">
                        {user.Nom.toUpperCase()} {user.Prenom.toUpperCase()}
                    </h2>

                    <form className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block font-semibold mb-1 text-black">Nom</label>
                            <input type="text" value={user.Nom} disabled className="w-full border border-blue-300 rounded-lg p-2 bg-gray-100 text-black" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-black">Prénom</label>
                            <input type="text" value={user.Prenom} disabled className="w-full border border-blue-300 rounded-lg p-2 bg-gray-100 text-black" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-black">Ville</label>
                            <input type="text" value={user.Ville} disabled className="w-full border border-blue-300 rounded-lg p-2 bg-gray-100 text-black" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-black">Téléphone</label>
                            <input type="text" value={user.Num_phone} disabled className="w-full border border-blue-300 rounded-lg p-2 bg-gray-100 text-black" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-black">Sexe</label>
                            <input type="text" value={user.Sexe} disabled className="w-full border border-blue-300 rounded-lg p-2 bg-gray-100 text-black" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-black">Email</label>
                            <input type="text" value={user.Email} disabled className="w-full border border-blue-300 rounded-lg p-2 bg-gray-100 text-black" />
                        </div>
                    </form>

                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm rounded-lg font-bold hover:bg-blue-700"
                            onClick={() => setIsUserModalOpen(true)}>
                            <FiEdit/> Modifier
                        </button>
                        {localStorage.getItem("role") === "Locataire" && (
                            <button
                                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 text-sm rounded-lg font-bold hover:bg-gray-700"
                                onClick={() => navigate("/role-change")}
                            >
                                <FiUserCheck /> Changer rôle
                            </button>
                        )}
                        <button
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 text-sm rounded-lg font-bold hover:bg-red-700"
                            onClick={handleDelete}>
                            <FiTrash/> Supprimer
                        </button>
                        <button
                            className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 text-sm rounded-lg font-bold hover:bg-blue-900 transition"
                            onClick={logout}
                        >
                            <FiLogOut/>
                            Se déconnecter
                        </button>

                    </div>
                </div>
            </div>

            {isUserModalOpen &&
                <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} user={user}
                           onUserUpdated={() => window.location.reload()}/>}
        </>
    );
};

export default Compte;
