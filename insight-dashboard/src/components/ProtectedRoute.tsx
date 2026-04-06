import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = () => {
   const { user, loading } = useAuth();
   
   if (loading) return null; // or loading spinner
   
   return user ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
