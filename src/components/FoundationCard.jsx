import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FavoriteButton from './FavoriteButton';
import { getConsistentImage } from '../utils/ImageUtils';

const FoundationCard = ({ foundation, user, showFavorite = true }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="h-100 shadow-sm foundation-card">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={foundation.image_url || getConsistentImage('foundations', foundation.id)} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {showFavorite && user && (
          <div className="position-absolute top-0 end-0 p-2">
            <FavoriteButton 
              item={foundation}
              itemType="foundation"
              user={user}
            />
          </div>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate">{foundation.legal_name}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          <i className="fas fa-map-marker-alt me-1"></i>
          {foundation.address || t('common.locationNotSpecified')}
        </Card.Text>
        <Card.Text className="flex-grow-1" style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical' 
        }}>
          {foundation.description || t('foundations.noDescription')}
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            {foundation.verified && (
              <Badge bg="success" className="me-2">
                <i className="fas fa-check-circle me-1"></i>
                {t('foundations.verified')}
              </Badge>
            )}
          </div>
          <div>
            <Button 
              as={Link} 
              to={`/foundations/${foundation.id}`}
              variant="outline-primary" 
              size="sm"
              className="me-2"
            >
              {t('common.viewDetails')}
            </Button>
            <Button 
              as={Link} 
              to={`/donate/${foundation.id}`}
              variant="success" 
              size="sm"
            >
              {t('common.donate')}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FoundationCard;