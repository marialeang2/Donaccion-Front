import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(t('login.invalidCredentials'));
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // If foundation, get foundation data
      if (data.user.user_type === 'foundation') {
        try {
          const foundationResponse = await fetch(`http://localhost:3001/api/foundations/user/${data.user.id}`, {
            headers: {
              'Authorization': `Bearer ${data.access_token}`
            }
          });
          
          if (foundationResponse.ok) {
            const foundationData = await foundationResponse.json();
            localStorage.setItem('foundationInfo', JSON.stringify(foundationData));
          }
        } catch (err) {
          console.error('Error fetching foundation data:', err);
        }
      }

      onLogin(data.user);
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || (data.user.user_type === 'foundation' ? '/foundation/dashboard' : '/');
      navigate(from, { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">{t('login.title')}</h2>
                <p className="text-muted">{t('login.subtitle')}</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('login.email')}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('login.emailPlaceholder')}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('login.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder={t('login.passwordPlaceholder')}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? t('common.loading') : t('login.submit')}
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  {t('login.noAccount')}{' '}
                  <Link to="/register" className="text-decoration-none">
                    {t('login.register')}
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;