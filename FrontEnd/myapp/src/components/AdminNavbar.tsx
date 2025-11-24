import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Navbar() { // Admin navbar
    const navigate = useNavigate();

    const handleUserManagementClick = () => {
        navigate("/admin/dashboard");
    };
    const handleUserAccountClick = () => {
        navigate("/compte");
    };
    const handleDemandeClick = () => {
        navigate("/admin/dashboard/demande");
    };
    const handleDemandelogementClick = () => {
        navigate("/admin/dashboard/demande/logements");
    };

    return (
        <nav className="fixed top-0 left-0 w-screen flex items-center justify-between px-6 h-14 bg-white shadow-md border-b border-gray-200 z-50">
            {/* Logo */}
            <div className="flex items-center space-x-3">
                <img src="/homeway.png" alt="HomeAway Logo" className="h-10 w-auto" />
                <h1 className="text-xl font-semibold text-gray-800">HomeAway</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center justify-center space-x-6 text-gray-700 text-sm font-medium">
                <a onClick={handleDemandeClick} className="hover:text-teal-600 cursor-pointer">Demande de changement de role</a>
                <a onClick={handleDemandelogementClick} className="hover:text-teal-600 cursor-pointer">Demande de logement</a>
                <a onClick={handleUserManagementClick} className="hover:text-teal-600 cursor-pointer">Utilisateurs</a>
                <Bell className="text-blue-500 cursor-pointer" size={22} />
                <User className="text-blue-500 cursor-pointer" size={22} onClick={handleUserAccountClick} />
            </div>
        </nav>
    );
}
