import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const { t } = useTranslation();
  
  const getNotificationIcon = (message) => {
    if (message.includes('donation')) return 'fas fa-donate';
    if (message.includes('opportunity') || message.includes('volunteer')) return 'fas fa-hands-helping';
    if (message.includes('certificate')) return 'fas fa-certificate';
    if (message.includes('application')) return 'fas fa-file-alt';
    return 'fas fa-bell';
  };
  
  return (
    <Card className={`mb-3 ${!notification.read ? 'border-primary' : ''}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1 d-flex">
            <div className="me-3">
              <i className={`${getNotificationIcon(notification.message)} text-primary`}></i>
            </div>
            <div>
              <p className="mb-1">{notification.message}</p>
              <small className="text-muted">
                {new Date(notification.notification_date).toLocaleDateString()} - {new Date(notification.notification_date).toLocaleTimeString()}
              </small>
            </div>
          </div>
          
          <div className="text-end">
            {!notification.read && (
              <Badge bg="primary" className="me-2">{t('notifications.new')}</Badge>
            )}
            <div className="btn-group">
              {!notification.read && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  {t('notifications.markAsRead')}
                </Button>
              )}
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => onDelete(notification.id)}
              >
                <i className="fas fa-trash"></i>
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NotificationItem;