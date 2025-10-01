// src/components/routeGuards/PublicRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const isAuth = Boolean(useSelector((s) => s.auth.userMessage));
  return isAuth ? <Navigate to="/dashboard" replace /> : children;
}
