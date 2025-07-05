import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {

  return document.cookie ? children : <Navigate to="/userEntry" replace />;
}
