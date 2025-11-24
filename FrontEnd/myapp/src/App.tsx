import React from "react";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/home/Home";
import { UtilisateursPage } from "./pages/Utilisateurs/ui/UtilisateursPage";
import { LoginPage } from "./pages/Login/ui/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import Compte from "./pages/account/ui/Compte";
import LocataireDashboard from "./pages/locataire/LocataireDashboard";
import ProprietaireDashboard from "./pages/proprietaire/ProprietaireDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import RoleChangePage from "./pages/account/component/RoleChangePage";
import RequestsList from "./pages/admin/component/RequestsList";
import RequestDemande from "./pages/admin/component/RequestDemande";
import LogementsEnAttente from "./pages/admin/component/LogementsEnAttente";
import { LogementDetails } from "./pages/Logement/ui/LogementDetails";
import ReservationsEnAttente from "./pages/proprietaire/components/ReservationsEnAttente.tsx";
import UserManagement from "./pages/admin/ui/UserManagement.tsx";
import MesReservations from "./pages/locataire/components/MesReservations.tsx";
import About from "./pages/home/About.tsx";
import UnifiedNavbar from "./components/UnifiedNavbar.tsx";
import Footer from "./components/Footer.tsx";
const queryClient = new QueryClient();
const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <UnifiedNavbar />
            <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/register" element={<UtilisateursPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logement/:id" element={<LogementDetails />} />

                {/* Route accessible à tous les rôles connectés */}
                <Route
                    path="/compte"
                    element={
                        <PrivateRoute allowedRoles={["Administrateur", "Locataire", "Propriétaire"]}>

                            <Compte />
                        </PrivateRoute>
                    }
                />

                {/* Routes ADMIN */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <PrivateRoute allowedRoles={["Administrateur"]}>
                            <>

                                <UserManagement />
                            </>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/dashboard/demande"
                    element={
                        <PrivateRoute allowedRoles={["Administrateur"]}>
                            <>

                                <RequestsList />
                            </>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/dashboard/demande/:id"
                    element={
                        <PrivateRoute allowedRoles={["Administrateur"]}>
                            <>

                                <RequestDemande />
                            </>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/dashboard/demande/logements"
                    element={
                        <PrivateRoute allowedRoles={["Administrateur"]}>


                                <LogementsEnAttente />

                        </PrivateRoute>
                    }
                />
                {/* LOCATAIRE */}
                <Route
                    path="/locataire/dashboard"
                    element={
                        <PrivateRoute allowedRoles={["Locataire"]}>
                            <LocataireDashboard />
                        </PrivateRoute>
                    }
                />
                {/* LOCATAIRE */}
                <Route
                    path="/role-change"
                    element={
                        <PrivateRoute allowedRoles={["Locataire"]}>
                            <RoleChangePage />
                        </PrivateRoute>
                    }
                />

                {/* PROPRIÉTAIRE */}
                <Route
                    path="/proprietaire/dashboard"
                    element={
                        <PrivateRoute allowedRoles={["Propriétaire"]}>
                            <ProprietaireDashboard />

                        </PrivateRoute>
                    }
                />
                <Route
                    path="/proprietaire/demande/reservation"
                    element={
                        <PrivateRoute allowedRoles={["Propriétaire"]}>
                            <ReservationsEnAttente />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/locataire/reservations"
                    element={
                        <PrivateRoute allowedRoles={["Locataire"]}>

                            <MesReservations />
                        </PrivateRoute>
                    }
                />
            </Routes>

            <ToastContainer />
            <Footer />
        </QueryClientProvider>
    );
};

export default App;
