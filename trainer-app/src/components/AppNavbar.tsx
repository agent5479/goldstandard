import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TenantSwitcher } from '@/components/TenantSwitcher';
import { usePermissions } from '@/hooks/usePermissions';
import { getRoleDisplayName } from '@/services/permissions';
import { APP_VERSION } from '@/services/config';
import { labels } from '@/data/terminology';

export function AppNavbar() {
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm mb-3 navbar-gsdt">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold text-primary">
          <i className="bi bi-dog me-2" />
          {labels.appName}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard" active={isActive('/dashboard')}>
              <i className="bi bi-house me-1" /> {labels.dashboard}
            </Nav.Link>
            <Nav.Link as={Link} to="/households" active={isActive('/households') && !isActive('/households/new')}>
              <i className="bi bi-people me-1" /> {labels.households}
            </Nav.Link>
            <Nav.Link as={Link} to="/dogs" active={isActive('/dogs')}>
              <i className="bi bi-dog me-1" /> {labels.dogs}
            </Nav.Link>
            {can('OWNER_CREATE') && (
              <Nav.Link as={Link} to="/imports/bookings" active={isActive('/imports/bookings')}>
                <i className="bi bi-cloud-download me-1" /> {labels.bookingImport}
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/logs" active={isActive('/logs')}>
              <i className="bi bi-journal-text me-1" /> {labels.sessionLogs}
            </Nav.Link>
            <Nav.Link as={Link} to="/schedule" active={isActive('/schedule')}>
              <i className="bi bi-calendar3 me-1" /> {labels.followUps}
            </Nav.Link>
            <Nav.Link as={Link} to="/focus" active={isActive('/focus')}>
              <i className="bi bi-list-check me-1" /> {labels.focus}
            </Nav.Link>
            <Nav.Link as={Link} to="/integrity" active={isActive('/integrity')}>
              <i className="bi bi-database-check me-1" /> {labels.integrity}
            </Nav.Link>
            {can('ACTIVITY_VIEW') && (
              <Nav.Link as={Link} to="/activity" active={isActive('/activity')}>
                <i className="bi bi-clock-history me-1" /> {labels.activityLog}
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/reports" active={isActive('/reports')}>
              <i className="bi bi-graph-up me-1" /> {labels.reports}
            </Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            <TenantSwitcher />
            <NavDropdown title={<><i className="bi bi-person-circle me-1" />{user?.username}</>} align="end">
              <NavDropdown.ItemText>
                {user?.role ? getRoleDisplayName(user.role) : 'User'} · v{APP_VERSION}
              </NavDropdown.ItemText>
              {user?.tenantName && (
                <NavDropdown.ItemText className="small text-muted">
                  {user.tenantName}
                </NavDropdown.ItemText>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate('/dashboard')}>{labels.dashboard}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
