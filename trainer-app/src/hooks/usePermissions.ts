import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/services/permissions';

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    can: (permission: string) => hasPermission(role, permission),
    isAdmin: () => role === 'admin',
  };
}
