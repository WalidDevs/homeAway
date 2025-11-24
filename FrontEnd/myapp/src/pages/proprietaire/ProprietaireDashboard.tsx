import { useState } from "react";
import { Button } from "../../components/Button";
import { AjoutLogementModal } from "../Logement/components/AjoutLogementModal.tsx";
import {LogementsList} from "../Logement/ui/LogementsList.tsx";
import Navbar from "../../../src/components/PropNavbar.tsx";
const ProprietaireDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full flex flex-col items-center bg-gray-100 pt-6">
            <Navbar/>
            <div className="w-full max-w-3xl px-4 mt-24">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Vos logements</h1>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#0084FF] hover:bg-[#006fd1] text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-200"
                    >
                        + Ajouter un logement
                    </Button>

                </div>
                <LogementsList/>
            </div>
            <AjoutLogementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>

        </div>
    );
};

export default ProprietaireDashboard;