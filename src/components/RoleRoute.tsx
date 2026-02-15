import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Database } from '../types/supabase';
import LoadingScreen from './LoadingScreen';

type Role = Database['public']['Tables']['profiles']['Row']['role'];

interface RoleRouteProps {
  allowedRoles: Role[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
