import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";

type DecodedToken = {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    exp: number;
};

type PrivateRouteProps = {
    allowedRoles: string[];
    children?: ReactNode;
};

const PrivateRoute = ({ allowedRoles, children }: PrivateRouteProps) => {
    const location = useLocation();
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (allowedRoles.includes(userRole)) {
            return children ? children : <Outlet />;
        } else {
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
