import React from 'react';
import aboutUsImage from '../../assets/Aboutus.jpg';
import './MyAboutInfo.css';
import { Container, Row, Col, Navbar, Nav, Image } from 'react-bootstrap';
import logoImage from '../../assets/rajalib.png';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <Container fluid className="min-vh-100 d-flex flex-column main-landingpage">
      <Navbar bg="white" expand="lg" className="mb-4 navabar-color">
        <Navbar.Brand href="#home">
          <Image src={logoImage} alt="Library Logo" height="60" />
          <span className="h4 ms-4">Rajaram Library</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" className="me-3">Home</Nav.Link>
            <Nav.Link href="#about" className="me-3">About Us</Nav.Link>
            <Nav.Link href="/contactus" className="me-3">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Row className="flex-grow-1 aboutUsContainer">
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <div>
            <h2 className="aboutUsTitle">About Us</h2>
            <h1 className="aboutUsMainTitle mt-5">Rajaram Library</h1>
            <p className="aboutUsText">
              Step into the world of Rajaram Library's management portal, where a treasure trove of over half a million books awaits.
              Simplify your search, tailor your reading list, and delight in the discovery of knowledge at your fingertips. Begin your
              effortless literary journey with us now.
            </p>
          </div>
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <Image src={aboutUsImage} alt="About Us" className="aboutUsImage" />
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default AboutUs;
