import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="app-loading">Loading your workspace…</div>;
  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
