import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import UserModal, { User as ModalUser } from "../../account/component/UserModal";
import { toast } from "react-toastify";

type ApiUser = {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email: string;
    roles: string[];
    num_phone?: string;
    sexe?: string;
    ville?: string;
};


const UserManagement = () => {
    const [users, setUsers] = useState<ApiUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<ModalUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Token manquant. Veuillez vous reconnecter.");
            return;
        }
        try {
            const res = await fetch(`http://localhost:5191/api/utilisateurs`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Erreur HTTP: " + res.status);
            const data = await res.json();
            console.log("Utilisateurs reçus depuis API :", data);
            setUsers(data);
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la récupération des utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Token manquant. Veuillez vous reconnecter.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5191/api/utilisateurs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Erreur HTTP: " + res.status);
            toast.success("Utilisateur supprimé avec succès !");
            await fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la suppression.");
        }
    };

    const handleEditUser = (user: ApiUser) => {
        setSelectedUser({
            id: user.id_utilisateur.toString(),
            Nom: user.nom,
            Prenom: user.prenom,
            Email: user.email,
            Num_phone: user.num_phone || "",
            Sexe: user.sexe || "",
            Ville: user.ville || "",
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen mt-20">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">👥 Liste des utilisateurs</h1>
            </div>

            {loading ? (
                <p className="text-gray-600">Chargement...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-600">Aucun utilisateur trouvé.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto bg-white shadow-lg rounded-xl border border-gray-200 mx-auto">
                        <thead>
                        <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase tracking-wider">
                            <th className="p-4">Nom</th>
                            <th className="p-4">Prénom</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id_utilisateur}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-4 text-gray-800 font-medium">{user.nom}</td>
                                <td className="p-4 text-gray-800">{user.prenom}</td>
                                <td className="p-4 text-gray-700">{user.email}</td>
                                <td className="p-4 flex gap-3">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 transition px-3 py-1.5 rounded-md text-sm font-medium"
                                        title="Modifier"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user.id_utilisateur)}
                                        className="flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 transition px-3 py-1.5 rounded-md text-sm font-medium"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedUser && (
                <UserModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    user={selectedUser}
                    onUserUpdated={fetchUsers}
                />
            )}
        </div>
    )
};

export default UserManagement;
