import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { LoginModal } from "../components/LoginModal.tsx";
import HomeNavbar from "../../../components/HomeNavbar.tsx"
export const LoginPage = () => {
    const { login } = useAuth();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <HomeNavbar onSearch={() => {}} />
            <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={login} />
            
        </div>
    );
};
