import React from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CertificateCard = ({ certificate, onDownload }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h5 className="card-title">
              <i className="fas fa-certificate text-warning me-2"></i>
              {t('certificates.participationCertificate')}
            </h5>
            <p className="text-muted mb-1">
              {certificate.description || t('certificates.defaultDescription')}
            </p>
            <p className="text-muted small">
              <i className="fas fa-calendar me-1"></i>
              {t('certificates.issuedOn')}: {new Date(certificate.issue_date).toLocaleDateString()}
            </p>
            {certificate.social_action && (
              <p className="text-primary small">
                <i className="fas fa-hands-helping me-1"></i>
                {certificate.social_action.description || t('certificates.socialAction')}
              </p>
            )}
          </div>
          
          
        </div>
      </Card.Body>
    </Card>
  );
};

export default CertificateCard;