import { useState } from "react";
import Navbar from "../../components/Navbar";
import LogementsExplorer from "../../components/LogementsExplorer.tsx";
export const LocataireDashboard = () => {
    const [motCle, setMotCle] = useState("");
    const [ville, setVille] = useState("Amiens");

    const handleSearch = (motCle: string, ville: string) => {
        setMotCle(motCle);
        setVille(ville);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <Navbar onSearch={handleSearch} />
            <div className="flex">
                <div className="w-full">
                    <LogementsExplorer motCle={motCle} ville={ville} />
                </div>
            </div>

        </div>
    );
};

export default LocataireDashboard;
