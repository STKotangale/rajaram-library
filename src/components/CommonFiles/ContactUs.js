import React from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Button, Image } from 'react-bootstrap';

import './CommonCSS/AboutContactFooter.css';
import logoImage from '../../assets/rajalib.png';
import { TelephoneFill, EnvelopeFill, GeoAltFill } from 'react-bootstrap-icons';
import Footer from './Footer';

const ContactUs = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

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
          <Nav.Link href="/aboutus" className="me-3">About Us</Nav.Link>
          <Nav.Link href="#contact" className="me-3">Contact Us</Nav.Link>
        </Nav>
        </Navbar.Collapse>
      </Navbar>


      <div className='text-center contactus-heading'>
        <h2>Contact Us</h2>
        <p className="form-invite contactus-message">Any questions or remarks? Just write us a message!</p>
      </div>
      {/* <Container fluid className="contact-us-page"> */}
      <Container fluid className="d-flex justify-content-center contact-us-page ">
        <Row >
          <Col md={4} className="contact-info">
            <div className="contact-info-details">
              <h2>Contact Information</h2>
              <p className="chat-invite">Say something to start a live chat!</p>
              <p className="info-item mt-5"><TelephoneFill /> +1012 3456 789</p>
              <p className="info-item"><EnvelopeFill /> rajlib@email.com</p>
              <p className="info-item"><GeoAltFill /> Rajaram Sitaram Dixit Library, Sitabardi, Nagpur 440012</p>
            </div>
          </Col>
          <Col md={6}>
            <Form className="contact-form ms-5" onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formFirstName">
                    <label>First Name</label>
                    <Form.Control type="text" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formLastName">
                    <label>Last Name</label>
                    <Form.Control type="text" required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label>Email</label>
                    <Form.Control type="email" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicPhone">
                    <label>Phone Number</label>
                    <Form.Control type="tel" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Select Subject</Form.Label>
                <Row>
                  <Col xs={3}>
                    <Form.Check
                      type="radio" name="subject" id="other" label=" Enquiry" value="Other"
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="radio" name="subject" id="other" label="Other" value="Other"
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="radio" name="subject" id="other" label="Other" value="Other"
                    />
                  </Col>
                  <Col xs={3}>
                    <Form.Check
                      type="radio" name="subject" id="other" label="Other" value="Other"
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicMessage">
                <label>Message</label>
                <Form.Control as="textarea" required />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button className='button-color' type="submit">Send Message</Button>
              </div>
            </Form>
          </Col >
        </Row >
      </Container >
      <Footer />
    </Container >
  );
};

export default ContactUs;
