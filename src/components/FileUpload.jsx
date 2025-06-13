import React, { useState, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const FileUpload = ({ onFileSelect, accept = "image/*", maxSize = 5 * 1024 * 1024 }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError(null);
    
    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
      setError(t('fileUpload.sizeTooLarge'));
      return;
    }
    
    setSelectedFile(file);
    
    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
    
    onFileSelect(file);
  };
  
  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    fileInputRef.current.value = '';
    onFileSelect(null);
  };
  
  return (
    <div>
     <Form.Group>
  <Form.Label htmlFor="file-upload">{t('fileUpload.selectFile')}</Form.Label>
  <div className="d-flex">
    <Form.Control
      id="file-upload"
      ref={fileInputRef}
      type="file"
      accept={accept}
      onChange={handleFileSelect}
      className="me-2"
    />
    {selectedFile && (
      <Button variant="outline-secondary" onClick={clearFile}>
        {t('common.clear')}
      </Button>
    )}
  </div>
  <Form.Text className="text-muted">
    {t('fileUpload.maxSize')}: {(maxSize / (1024 * 1024)).toFixed(1)}MB
  </Form.Text>
</Form.Group>

      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {preview && (
        <div className="mt-3 text-center">
          <img 
            src={preview} 
            alt="Preview" 
            className="img-thumbnail" 
            style={{ maxHeight: '200px' }}
          />
        </div>
      )}
      
      {selectedFile && !preview && (
        <div className="mt-3">
          <Alert variant="info">
            <i className="fas fa-file me-2"></i>
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </Alert>
        </div>
      )}
    </div>
  );
};

export default FileUpload;