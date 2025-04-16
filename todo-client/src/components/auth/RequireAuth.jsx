import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext'; // Importez votre contexte

export default function RequireAuth({ children }) {
    const { user, isLoading } = useAuth(); // Utilisez le contexte
    const location = useLocation();

  // Pendant le chargement initial
    if (isLoading) {
        return <div>Chargement...</div>; // Ou un spinner
    }

  // Si non authentifié
    if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
    }

  // Si authentifié
    return children;
}