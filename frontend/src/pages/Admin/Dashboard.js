import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { FaBuilding, FaPhoneAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="shadow-lg p-4 rounded w-50">
        <Card.Body>
          <h2 className="text-center mb-4 text-dark">Welcome to the Admin Dashboard</h2>
          <Row className="g-4 text-center justify-content-center">
            
            <Col xs={12} sm={6} md={5}>
              <Link to="/admin/companies" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm hover-shadow">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <FaBuilding size={50} className="text-primary mb-3" />
                    <h5 className="text-dark">Manage Companies</h5>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

           
            <Col xs={12} sm={6} md={5}>
              <Link to="/admin/communication-methods" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm hover-shadow">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <FaPhoneAlt size={50} className="text-secondary mb-3" />
                    <h5 className="text-dark">Manage Communication Methods</h5>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;
