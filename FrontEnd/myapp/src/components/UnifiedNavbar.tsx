import { useEffect, useState } from "react";
import PropNavbar from "./PropNavbar";
import AdminNavbar from "./AdminNavbar";
import HomeNavbar from "./HomeNavbar";
import Navbar from "./Navbar.tsx"; // Locataire

export default function UnifiedNavbar() {
    const [role, setRole] = useState<string | null>(null);

    // ⏱ Check localStorage on mount + listen for changes
    useEffect(() => {
        const fetchRole = () => {
            const storedRole = localStorage.getItem("role");
            setRole(storedRole);
        };

        // Run on initial mount
        fetchRole();

        // Listen to changes from other tabs/windows
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "role") {
                fetchRole();
            }
        };
        window.addEventListener("storage", handleStorageChange);

        // Optional: polling as a fallback (useful if role is changed within same tab)
        const interval = setInterval(fetchRole, 1000); // every second

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // 🚫 Still loading or role not set
    /*if (role === null) {
        return null;
    }*/

    // ✅ Role-based navbar
    if (role === "Propriétaire") {
        return <PropNavbar />;
    } else if (role === "Administrateur") {
        return <AdminNavbar />;
    } else if (role === "Locataire") {
        return <Navbar />;
    } else {
        return <HomeNavbar onSearch={(motCle, ville) => {
            console.log("Recherche anonyme :", motCle, ville);
        }} />;
    }
}
