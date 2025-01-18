import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
    const date = new Date();
    const year = date.getFullYear();

    return (
        <Container fluid className="footer bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <Row className="justify-content-center align-items-center py-4">
                {/* Autor */}
                <Col md="4" className="footer-copywright text-center py-2">
                    <h3 className="text-lg font-bold">Designed and Developed by IAI</h3>
                </Col>
                {/* Copyright */}
                <Col md="4" className="footer-copywright text-center py-2">
                    <h3 className="text-lg font-semibold">Copyright © {year} SB</h3>
                </Col>

            </Row>
        </Container>
    );
}

export default Footer;
