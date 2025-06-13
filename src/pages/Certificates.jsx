import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CertificateCard from '../components/CertificateCard';

const Certificates = ({ user }) => {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        setLoading(false);
        return;
      }

      const userObj = JSON.parse(userData);
      
      // Hacer petición con el token en el header
      const response = await fetch(`http://localhost:3001/api/certificates/user/${userObj.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido, limpiar y redirigir
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          return;
        }
        throw new Error('Error al obtener certificados');
      }

      const data = await response.json();
      setCertificates(data);

    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/certificates/${certificateId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Error al descargar certificado');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Verificar si hay token/usuario
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  
  if (!token || !userData) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <i className="fas fa-lock fa-3x text-primary mb-3"></i>
            <h3>{t('common.loginShort')}</h3>
            <p className="text-muted">{t('certificates.loginRequiredToViewCertificates')}</p>
            <Button as={Link} to="/login" variant="primary" size="lg">
              <i className="fas fa-sign-in-alt me-2"></i>
              {t('common.loginShort')}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchCertificates} />;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">{t('certificates.title')}</h1>
          <p className="text-muted">
            {t('certificates.subtitle', { count: certificates.length })}
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          {certificates.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-certificate fa-3x text-muted mb-3"></i>
              <h5>{t('certificates.noCertificates')}</h5>
              <p className="text-muted">{t('certificates.noCertificatesDescription')}</p>
              <Button as={Link} to="/opportunities" variant="primary">
                {t('home.findOpportunities')}
              </Button>
            </div>
          ) : (
            certificates.map(certificate => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onDownload={handleDownload}
              />
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Certificates;