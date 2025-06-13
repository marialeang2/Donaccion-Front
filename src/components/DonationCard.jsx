import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DonationCard = ({ donation, showFoundation = false }) => {
  const { t } = useTranslation();
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };
  
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h5 className="card-title d-flex align-items-center">
              <i className="fas fa-donate text-success me-2"></i>
              {formatAmount(donation.amount)}
              {donation.is_monthly && (
                <Badge bg="info" className="ms-2">
                  {t('donations.monthly')}
                </Badge>
              )}
            </h5>
            
            {showFoundation && donation.foundation && (
              <h6 className="text-muted">
                <Link to={`/foundations/${donation.foundation.id}`} className="text-decoration-none">
                  {donation.foundation.legal_name}
                </Link>
              </h6>
            )}
            
            {donation.dedication && (
              <div className="mt-2">
                <small className="text-muted">{t('donations.dedication')}:</small>
                <p className="small font-italic">"{donation.dedication}"</p>
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DonationCard;