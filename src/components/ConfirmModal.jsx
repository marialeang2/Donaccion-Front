import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ConfirmModal = ({ show, onHide, onConfirm, title, message, variant = 'danger' }) => {
  const { t } = useTranslation();
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('common.cancel')}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {t('common.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;