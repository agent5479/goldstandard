import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { APP_VERSION } from '@/services/config';
import { labels } from '@/data/terminology';

export default function LoginPage() {
  const { login, user, usesFirebaseAuth, authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setMessage({ type: 'danger', text: result.message });
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <Card className="shadow login-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-dog text-primary" style={{ fontSize: '3rem' }} />
                  <h2 className="mt-2">{labels.appName}</h2>
                  <p className="text-muted">{labels.appTagline}</p>
                  <span className="badge bg-primary">v{APP_VERSION}</span>
                </div>
                {usesFirebaseAuth ? (
                  <p className="small text-muted text-center mb-3">
                    Sign in with your Firebase account. Database access requires authentication.
                  </p>
                ) : (
                  <p className="small text-warning text-center mb-3">
                    Firebase not configured — offline dev login only.
                  </p>
                )}
                {authError && !user && (
                  <Alert variant="warning">{authError}</Alert>
                )}
                {message && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>{usesFirebaseAuth ? 'Email' : 'Username'}</Form.Label>
                    <Form.Control
                      type={usesFirebaseAuth ? 'email' : 'text'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Login'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
