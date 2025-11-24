import { useState } from "react";
import { Search, MapPin } from "lucide-react";

type Props = {
    onSearch: (searchTerm: string, selectedCity: string) => void;
};
export default function HomeNavbar({ onSearch }: Props) { // anonymous navbar
    const [location, setLocation] = useState("Amiens");
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = () => {
        onSearch(searchTerm, location);
    };

    return (
        <nav className="fixed top-0 left-0 w-screen flex items-center justify-between px-6 h-14 bg-white shadow-md border-b border-gray-200 z-50">
            <div className="flex items-center space-x-3">
                <img src="/homeway.png" alt="HomeAway Logo" className="h-10 w-auto" />
                <h1 className="text-xl font-semibold text-gray-800">HomeAway</h1>
            </div>
            
            <div className="relative w-[500px]">
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 shadow-sm bg-white">
                    {/* Location Selector */}
                    <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
                        <MapPin size={18} className="text-teal-600" />
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-transparent text-gray-700 font-medium text-sm focus:outline-none"
                        >
                            {[
                                "Amiens", "Paris", "Lille", "Le Havre", "Lens", "Lyon", "Toulouse",
                                "Rennes", "Nantes", "Grenoble", "Rouen", "Beauvais"
                            ].map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        
                    </div>
                    
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher par lieu, district, nom de rue"
                        className="w-full bg-transparent text-gray-600 text-sm focus:outline-none px-2"
                    />
                    
                    <button onClick={handleSearch} className="text-teal-600 p-1">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-6 text-gray-700 text-sm font-medium">
                <a href="/" className="hover:text-teal-600">Accueil</a>
                <a href="/about" className="hover:text-teal-600">À propos</a>
                <a href="/register" className="hover:text-teal-600">S'inscrire</a>
                <a href="/login" className="hover:text-teal-600">Se connecter</a>
            </div>
        </nav>
    );
}
