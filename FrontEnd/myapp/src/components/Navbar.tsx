import {User} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {MapPin} from "lucide-react";
import {Search} from "lucide-react";
import {Bell} from "lucide-react";

type Props = {
    onSearch?: (motCle: string, ville: string) => void;
};

export default function Navbar({ onSearch }: Props) { // Navbar locataire
    const [location, setLocation] = useState("Amiens");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleUserClick = () => navigate("/compte");
const handleoffresClick = () => {
    navigate("/locataire/dashboard");
}
const handleReservationClick = () => {
    navigate("/locataire/reservations");
}

    const handleSearch = () => {
        if (onSearch) onSearch(searchTerm, location);
    };

    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 h-14 bg-white shadow-md border-b border-gray-200 z-50">
            {/* Logo */}
            <div className="flex items-center space-x-3">
                <img src="/homeway.png" alt="HomeAway Logo" className="h-10 w-auto" />
                <h1 className="text-xl font-semibold text-gray-800">HomeAway</h1>
            </div>

            {/* Search Bar */}
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 w-[500px] shadow-sm">
                <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
                    <MapPin size={18} className="text-teal-600" />
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-transparent text-gray-700 font-medium text-sm focus:outline-none"
                    >
                        {["Amiens", "Paris", "Lille", "Le Havre", "Lens", "Lyon", "Toulouse",
                            "Rennes", "Nantes", "Grenoble", "Rouen", "Beauvais"].map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full bg-transparent text-gray-600 text-sm focus:outline-none px-2"
                />
                <button className="text-teal-600 p-1" onClick={handleSearch}>
                    <Search size={20} />
                </button>
            </div>

            <div className="flex items-center space-x-6 text-gray-700 text-sm font-medium">
                <a onClick={()=>{handleReservationClick()}}>Réservations</a>
                <a onClick={()=>{handleoffresClick()}}>Offres</a>
                <Bell className="text-blue-500 cursor-pointer" size={22} />
                <User className="text-blue-500 cursor-pointer" size={22} onClick={handleUserClick} />
            </div>
        </nav>
    );
}
