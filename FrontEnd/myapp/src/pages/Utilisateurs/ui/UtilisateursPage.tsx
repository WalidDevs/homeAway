import { useState } from "react";
import { UtilisateurModalForm } from "../components/UtilisateurModalForm";
import HomeNavbar from "../../../components/HomeNavbar.tsx";
export const UtilisateursPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <HomeNavbar onSearch={() => {}} />
            <UtilisateurModalForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};
