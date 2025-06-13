import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ParticipantCard = ({ participant, onStatusChange, onGenerateCertificate, readOnly = false }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: t('participants.pending') },
      accepted: { bg: 'success', text: t('participants.accepted') },
      rejected: { bg: 'danger', text: t('participants.rejected') }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };
  
  const handleStatusChange = async (newStatus) => {
    if (readOnly) {
      alert(t('participants.readOnlyAdminCannotModify'));
      return;
    }
    
    setLoading(true);
    try {
      await onStatusChange(participant.id, newStatus);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateCertificate = async () => {
    if (readOnly) {
      alert(t('participants.readOnlyAdminCannotModify'));
      return;
    }
    
    setLoading(true);
    try {
      await onGenerateCertificate(participant);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h5>{participant.user?.name || t('common.anonymousUser')}</h5>
            <p className="text-muted mb-1">
              <i className="fas fa-envelope me-1"></i>
              {participant.user?.email || t('common.emailNotAvailable')}
            </p>
            <p className="text-muted mb-1">
              <i className="fas fa-calendar me-1"></i>
              {t('participants.appliedOn')}: {new Date(participant.request_date).toLocaleDateString()}
            </p>
            {participant.message && (
              <div className="mt-2">
                <small className="text-muted">{t('participants.message')}:</small>
                <p className="small">{participant.message}</p>
              </div>
            )}
          </div>
          
          <div className="text-end">
            {getStatusBadge(participant.status)}
            {readOnly && (
              <div className="mt-1">
                <small className="text-muted">{t('participants.readOnlyView')}</small>
              </div>
            )}
          </div>
        </div>
        
        {!readOnly && (
          <div className="mt-3">
            {participant.status === 'pending' && (
              <>
                <Button 
                  variant="success" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleStatusChange('accepted')}
                  disabled={loading}
                >
                  {t('participants.accept')}
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={loading}
                >
                  {t('participants.reject')}
                </Button>
              </>
            )}
            
            {participant.status === 'accepted' && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleGenerateCertificate}
                disabled={loading}
              >
                <i className="fas fa-certificate me-1"></i>
                {t('participants.generateCertificate')}
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ParticipantCard;