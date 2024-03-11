import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import logo from '../css/2.png';

function Home() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Simulate step-wise appearance with a delay
    const timeout = setTimeout(() => {
      setActiveStep(1);
      setTimeout(() => setActiveStep(2), 500);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
    <Navbar />
    <div className="home-container" >
      <Container fluid>
        <Row className="d-flex align-items-center" style={{marginLeft:'240px',marginTop:'75px'}}>
          <Col xs={12} md={6} className="text-container">
            <h1><span  style={{fontSize:'80px'}}>E-commerce</span><br/><br/><span style={{fontSize:'60px'}}>Online</span><br/><br/><span style={{fontSize:'35px',fontWeight:'bold'}}>Store</span></h1>
          </Col>
          <Col xs={12} md={6} className="image-container">
            <img src={logo} alt="" style={{ width: '500px', height: '500px' }} />
          </Col>
        </Row>
      </Container>
    </div>
    </>
  );
}

export default Home;
