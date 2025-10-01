// src/components/routeGuards/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const isAuth = Boolean(useSelector((s) => s.auth.userMessage));
  return isAuth ? children : <Navigate to="/login" replace />;
}
