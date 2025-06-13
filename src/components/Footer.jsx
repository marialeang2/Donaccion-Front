import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-primary mb-3">Don Acción</h5>
            <p className="text-light">{t("footer.description")}</p>
            <div className="d-flex gap-3">
              <a href="https://www.uniandes.edu.co/" className="text-light">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.uniandes.edu.co/" className="text-light">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.uniandes.edu.co/" className="text-light">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.uniandes.edu.co/" className="text-light">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4"></Col>
          <Col lg={2} md={6} className="mb-4">
            <h6 className="mb-3">{t("footer.explore")}</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/foundations"
                  className="text-light text-decoration-none"
                >
                  {t("footer.foundations")}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/opportunities"
                  className="text-light text-decoration-none"
                >
                  {t("footer.opportunities")}
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="mb-3">{t("footer.company")}</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">
                  {t("footer.about")}
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0 text-light">
              &copy; {currentYear} Don Acción. {t("footer.allRights")}
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0 text-light">
              {t("footer.madeWith")}{" "}
              <i className="fas fa-heart text-danger"></i>{" "}
              {t("footer.inColombia")}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
