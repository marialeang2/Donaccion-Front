import React from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const LoadingSpinner = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-5">
      <Spinner
        animation="border"
        variant="primary"
        className="mb-3"
        role="status"
      />
      <p className="text-muted">{message || t("common.loading")}</p>
    </div>
  );
};

export default LoadingSpinner;
