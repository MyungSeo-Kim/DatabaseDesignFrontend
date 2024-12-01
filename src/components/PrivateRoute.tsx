import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
    children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const { user } = useAuth();

    if (!user?.id) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;
