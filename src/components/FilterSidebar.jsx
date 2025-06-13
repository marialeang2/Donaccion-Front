import { Button, Card, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const { t } = useTranslation();

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">{t("filters.title")}</h5>
      </Card.Header>
      <Card.Body>
        {/* Status Filter */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="statusSelect">{t("filters.status")}</Form.Label>
          <Form.Select
            id="statusSelect"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">{t("filters.allStatuses")}</option>
            <option value="active">{t("opportunities.active")}</option>
            <option value="upcoming">{t("opportunities.upcoming")}</option>
            <option value="ended">{t("opportunities.ended")}</option>
          </Form.Select>
        </Form.Group>

        {/* Location Filter */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="locationInput">
            {t("filters.location")}
          </Form.Label>
          <Form.Control
            id="locationInput"
            type="text"
            value={filters.location || ""}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            placeholder={t("filters.locationPlaceholder")}
          />
        </Form.Group>

        {/* Date Range Filter */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="startDateInput">
            {t("filters.startDate")}
          </Form.Label>
          <Form.Control
            id="startDateInput"
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="endDateInput">{t("filters.endDate")}</Form.Label>
          <Form.Control
            id="endDateInput"
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </Form.Group>

        {/* Clear Filters */}
        <Button
          variant="outline-secondary"
          onClick={onClearFilters}
          className="w-100"
        >
          {t("filters.clear")}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FilterSidebar;
