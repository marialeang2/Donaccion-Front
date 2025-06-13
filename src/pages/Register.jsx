import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Foundation fields
    address: '',
    phone: '',
    website: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      const name = userType === 'user' 
        ? `${formData.firstName} ${formData.lastName}`.trim()
        : formData.name;

      // Register user
      const registerData = {
        name,
        email: formData.email,
        password: formData.password,
        user_type: userType
      };

      const registerResponse = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      if (!registerResponse.ok) {
        throw new Error(t('register.userCreationError'));
      }

      // Auto-login
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (!loginResponse.ok) {
        throw new Error(t('register.loginError'));
      }

      const loginData = await loginResponse.json();
      const token = loginData.access_token;

      // If foundation, create foundation profile
      if (userType === 'foundation') {
        const foundationData = {
          user_id: loginData.user.id,
          legal_name: name,
          address: formData.address,
          phone: formData.phone,
          website: formData.website
        };

        const foundationResponse = await fetch('http://localhost:3001/api/foundations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(foundationData)
        });

        if (!foundationResponse.ok) {
          throw new Error(t('register.foundationCreationError'));
        }
      }

      navigate('/login', { 
        state: { message: t('register.success') }
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">{t('register.title')}</h2>
                <p className="text-muted">{t('register.subtitle')}</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <div className="text-center mb-4">
                <ToggleButtonGroup
                  type="radio"
                  name="userType"
                  value={userType}
                  onChange={setUserType}
                >
                  <ToggleButton id="user-type" value="user" variant="outline-primary">
                    {t('register.individual')}
                  </ToggleButton>
                  <ToggleButton id="foundation-type" value="foundation" variant="outline-primary">
                    {t('register.foundation')}
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>

              <Form onSubmit={handleSubmit}>
                {userType === 'user' ? (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t('register.firstName')}</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t('register.lastName')}</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                ) : (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('register.foundationName')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>{t('register.address')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>{t('register.phone')}</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>{t('register.website')}</Form.Label>
                          <Form.Control
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>{t('register.email')}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('register.password')}</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('register.confirmPassword')}</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? t('common.loading') : t('register.submit')}
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  {t('register.hasAccount')}{' '}
                  <Link to="/login" className="text-decoration-none">
                    {t('register.login')}
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

export default Register;