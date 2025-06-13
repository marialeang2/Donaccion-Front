import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col lg={6}>
          <div className="py-5">
            {/* 404 Illustration */}
            <div className="mb-4">
              <i className="fas fa-exclamation-triangle fa-5x text-warning"></i>
            </div>
            
            {/* Error Message */}
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="mb-3">{t('notFound.title')}</h2>
            <p className="text-muted mb-4">{t('notFound.message')}</p>
            
            {/* Action Buttons */}
            <div className="d-flex justify-content-center gap-3">
              <Button as={Link} to="/" variant="primary" size="lg">
                <i className="fas fa-home me-2"></i>
                {t('notFound.goHome')}
              </Button>
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={() => window.history.back()}
              >
                <i className="fas fa-arrow-left me-2"></i>
                {t('notFound.goBack')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* Helpful Links */}
      <Row className="mt-5">
        <Col>
          <h4 className="text-center mb-4">{t('notFound.helpfulLinks')}</h4>
          <Row className="justify-content-center">
            <Col lg={3} md={6} className="mb-3">
              <div className="text-center">
                <Link to="/foundations" className="text-decoration-none">
                  <div className="border rounded p-4 h-100 hover-shadow">
                    <i className="fas fa-building text-primary fa-2x mb-3"></i>
                    <h5>{t('notFound.links.foundations')}</h5>
                    <p className="text-muted small">{t('notFound.links.foundationsDescription')}</p>
                  </div>
                </Link>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="text-center">
                <Link to="/opportunities" className="text-decoration-none">
                  <div className="border rounded p-4 h-100 hover-shadow">
                    <i className="fas fa-hands-helping text-success fa-2x mb-3"></i>
                    <h5>{t('notFound.links.opportunities')}</h5>
                    <p className="text-muted small">{t('notFound.links.opportunitiesDescription')}</p>
                  </div>
                </Link>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="text-center">
                <Link to="/about" className="text-decoration-none">
                  <div className="border rounded p-4 h-100 hover-shadow">
                    <i className="fas fa-info-circle text-info fa-2x mb-3"></i>
                    <h5>{t('notFound.links.about')}</h5>
                    <p className="text-muted small">{t('notFound.links.aboutDescription')}</p>
                  </div>
                </Link>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <div className="text-center">
                <Link to="/search" className="text-decoration-none">
                  <div className="border rounded p-4 h-100 hover-shadow">
                    <i className="fas fa-search text-warning fa-2x mb-3"></i>
                    <h5>{t('notFound.links.search')}</h5>
                    <p className="text-muted small">{t('notFound.links.searchDescription')}</p>
                  </div>
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;