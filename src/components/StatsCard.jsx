import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ title, value, icon, variant = 'primary', trend }) => {
  const getCardClass = () => {
    const variants = {
      primary: 'border-primary',
      success: 'border-success',
      warning: 'border-warning',
      danger: 'border-danger',
      info: 'border-info'
    };
    return variants[variant] || variants.primary;
  };
  
  const getIconClass = () => {
    const variants = {
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger',
      info: 'text-info'
    };
    return variants[variant] || variants.primary;
  };
  
return (
  <Card className={`h-100 ${getCardClass()}`}>
    <Card.Body className="text-center">
      <div className={`fs-1 ${getIconClass()}`} data-testid="icon-wrapper">
        <i className={icon} data-testid="main-icon"></i>
      </div>
      <h3 className="mt-3 mb-0">{value}</h3>
      <p className="text-muted">{title}</p>
      {trend && (
        <small
          className={`text-${trend.type === 'up' ? 'success' : 'danger'}`}
          data-testid="trend"
        >
          <i
            className={`fas fa-arrow-${trend.type} me-1`}
            data-testid={`arrow-${trend.type}`}
          ></i>
          {trend.value}%
        </small>
      )}
    </Card.Body>
  </Card>
);

};

export default StatsCard;