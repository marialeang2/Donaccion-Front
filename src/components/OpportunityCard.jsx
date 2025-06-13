import React, { useState} from 'react';
import { Card, Button, Badge, Modal, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FavoriteButton from './FavoriteButton';
import RatingStars from './RatingStars';
import { getConsistentImage } from '../utils/ImageUtils';

const OpportunityCard = ({ opportunity, user, showFavorite = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applying, setApplying] = useState(false);
  
  
  
  
  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(opportunity.start_date);
    const endDate = new Date(opportunity.end_date);
    
    if (now < startDate) {
      return <Badge bg="info">{t('opportunities.upcoming')}</Badge>;
    } else if (now >= startDate && now <= endDate) {
      return <Badge bg="success">{t('opportunities.active')}</Badge>;
    } else {
      return <Badge bg="secondary">{t('opportunities.ended')}</Badge>;
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.user_type === 'foundation') {
      alert(t('opportunity.foundationsCannotApply'));
      return;
    }
    
    setShowApplicationModal(true);
  };
  
  
  const submitApplication = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/opportunities/${opportunity.id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: applicationMessage
        })
      });

      if (!response.ok) {
        throw new Error(t('opportunity.applicationError'));
      }

      alert(t('opportunity.applicationSuccess'));
      setShowApplicationModal(false);
      setApplicationMessage('');
    } catch (err) {
      alert(err.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <Container className='h-100 opportunity-card'>
    <Card className="d-flex flex-column w-100 h-100 shadow-sm">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={opportunity.image ? opportunity.image : getConsistentImage('opportunities', opportunity.id)} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {showFavorite && user && (
          <div className="position-absolute top-0 end-0 p-2">
            <FavoriteButton 
              item={opportunity}
              itemType="opportunity"
              user={user}
            />
          </div>
        )}
        <div className="position-absolute top-0 start-0 p-2">
          {getStatusBadge()}
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column" >
        <Card.Title className="text-truncate">
          {opportunity.title || opportunity.description?.substring(0, 50) + '...'}
        </Card.Title>
        
        <Card.Subtitle className="text-muted mb-2">
          {opportunity.foundation?.legal_name || t('opportunities.foundation')}
        </Card.Subtitle>
        
        <Card.Text className="flex-grow-1" style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical' 
        }}>
          {opportunity.description || t('opportunities.noDescription')}
        </Card.Text>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-calendar me-1"></i>
            {new Date(opportunity.start_date).toLocaleDateString()} - {new Date(opportunity.end_date).toLocaleDateString()}
          </small>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-map-marker-alt me-1"></i>
            {opportunity.location || opportunity.foundation?.address || t('common.locationNotSpecified')}
          </small>
        </div>
        
        <div className="mb-3 text-center">
          <RatingStars rating={opportunity.averageRating || 0} size="sm" />
        </div>
        
        <div className="d-flex justify-content-between mt-auto">
          <Button 
            as={Link} 
            to={`/opportunities/${opportunity.id}`}
            variant="outline-primary" 
            size="sm"
          >
            {t('common.viewDetails')}
          </Button>
          
          {user && user.user_type === 'user' && (
            <Button 
              variant="success" 
              size="sm"
              onClick={handleApply}
            >
              {t('opportunities.apply')}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
    
      {/* Application Modal */}
      <Modal show={showApplicationModal} onHide={() => setShowApplicationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('opportunity.applicationForm')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t('opportunity.applicationMessage')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                placeholder={t('opportunity.applicationPlaceholder')}
              />
              <Form.Text className="text-muted">
                {t('opportunity.applicationHint')}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplicationModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={submitApplication}
            disabled={applying}
          >
            {applying ? t('common.submitting') : t('opportunity.submitApplication')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OpportunityCard;