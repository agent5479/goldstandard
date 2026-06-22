import { NavDropdown } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleDisplayName } from '@/services/permissions';

export function TenantSwitcher() {
  const { user, switchTenant } = useAuth();
  const tenants = user?.availableTenants || [];

  if (tenants.length <= 1) {
    if (!user?.tenantName) return null;
    return (
      <span className="navbar-text small text-muted d-none d-lg-inline me-3">
        {user.tenantName}
      </span>
    );
  }

  return (
    <NavDropdown
      title={<><i className="bi bi-building me-1" />{user?.tenantName || 'Select tenant'}</>}
      align="end"
      className="me-2"
    >
      {tenants.map((t) => (
        <NavDropdown.Item
          key={t.tenantId}
          active={t.tenantId === user?.tenantId}
          onClick={() => switchTenant(t.tenantId)}
        >
          {t.tenantName}
          <span className="text-muted small ms-2">({getRoleDisplayName(t.role)})</span>
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
}
