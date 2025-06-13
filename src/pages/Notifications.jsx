import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import NotificationItem from '../components/NotificationItem';

const Notifications = ({ user }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        setLoading(false);
        return;
      }

      const userObj = JSON.parse(userData);
      
      const response = await fetch(`http://localhost:3001/api/notifications/user/${userObj.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          return;
        }
        throw new Error(t('notifications.fetchError'));
      }

      const data = await response.json();
      setNotifications(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      await fetch(`http://localhost:3001/api/notifications/user/${userData.id}/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchNotifications} />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">
                {t('notifications.title')}
                {unreadCount > 0 && (
                  <Badge bg="danger" className="ms-2">{unreadCount}</Badge>
                )}
              </h1>
              <p className="text-muted">
                {t('notifications.subtitle', { 
                  total: notifications.length,
                  unread: unreadCount 
                })}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline-primary" onClick={markAllAsRead}>
                {t('notifications.markAllAsRead')}
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {notifications.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-bell fa-3x text-muted mb-3"></i>
              <h5>{t('notifications.noNotifications')}</h5>
              <p className="text-muted">{t('notifications.noNotificationsDescription')}</p>
            </div>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;