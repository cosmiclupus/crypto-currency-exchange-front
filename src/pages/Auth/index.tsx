import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Auth from '../../components/Auth';
import { useAuth } from '../../contexts/Auth';

export default function AuthPage() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to orders page if already authenticated,
  // but only if not manually navigated to auth page
  useEffect(() => {
    if (state.isAuthenticated && !location.state?.manual) {
      navigate('/orders');
    }
  }, [state.isAuthenticated, navigate, location.state]);
  
 return (
    <div className="min-vh-100 d-flex justify-content-center bg-light " 
         style={{ alignItems: 'flex-start', paddingTop: '8rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5} className="px-3">
            <Auth />
          </Col>
        </Row>
      </Container>
    </div>
  );
}