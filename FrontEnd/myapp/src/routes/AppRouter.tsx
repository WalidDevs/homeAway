import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "../pages/home/Home";
import { UtilisateursPage } from "../pages/Utilisateurs/ui/UtilisateursPage.tsx";
import { LoginPage } from "../pages/Login/ui/LoginPage.tsx";
import Compte from "../pages/account/ui/Compte.tsx";
import RoleChangePage from "../pages/account/component/RoleChangePage.tsx";
import RequestsList from "../pages/admin/component/RequestsList.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/register",
        element: <UtilisateursPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/account",
        element: <Compte />,
    },
    {
        path: "/role-change",
        element: <RoleChangePage />, 
    },
    {
        path: "/demande",
        element: <RequestsList />,
    },
]);

console.log(" Routes chargées :", router.routes);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
