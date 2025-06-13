import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ error, onRetry }) => {
  const { t } = useTranslation();
  
  return (
    <Alert variant="danger" className="text-center">
      <Alert.Heading>{t('common.error')}</Alert.Heading>
      <p>{error}</p>
      {onRetry && (
        <Button variant="outline-danger" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </Alert>
  );
};

export default ErrorMessage;