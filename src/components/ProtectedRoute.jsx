import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;

  // Si no hay usuario, al login
  if (!user) return <Navigate to="/login" />;

  // Si el rol no coincide con el requerido, al catálogo
  if (roleRequired && user.rol !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
