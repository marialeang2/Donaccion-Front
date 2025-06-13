import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onSearch, placeholder, loading = false }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder || t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          variant="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin" data-testid="spinner-icon"></i>
          ) : (
            <i className="fas fa-search"></i>
          )}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;