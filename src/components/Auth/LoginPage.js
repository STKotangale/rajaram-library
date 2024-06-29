import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Button, Image } from 'react-bootstrap';
import logoImage from '../../assets/rajalib.png';
import illustrationImage from '../../assets/rajaram.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Book, Journal, PcDisplay, CloudArrowDown } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from './AuthProvider';
import BooksImages from '../CommonFiles/StaticImagesBook';
import Footer from '../CommonFiles/Footer';
import './AuthCSS/LoginPage.css';

const LoginPage = () => {
  //post
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //auth
  const navigate = useNavigate();
  const BaseURL = process.env.REACT_APP_BASE_URL;
  const { login } = useAuth();

  //post
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BaseURL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      const userRole = data.roles[0];
      login(data.username, data.accessToken, data.tokenType, data.id, data.memberId);

      localStorage.setItem('accessToken', data.accessToken);
      console.log("token", data.accessToken);
      toast.success('Login successful!');
      if (userRole === 'ADMIN') {
        navigate('/admindashboard');
      } else if (userRole === 'MEMBER') {
        navigate('/memberdashboard');
      } else {
        throw new Error('Invalid role');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
    }
  };


  return (
    <div className='login-page-scroll'>
      <div className='footer-copyright-bottom mb-5'>
        <Navbar bg="white" expand="lg" className="navabar-color me-2">
          <Navbar.Brand href="#home">
            <Image src={logoImage} alt="Library Logo" className='ms-3 hide-on-mobile' height="60" />
            <span className="h4 ms-4">Rajaram Library</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className="me-3 ms-2">Home</Nav.Link>
              <Nav.Link href="/aboutus" className="me-3 ms-2">About Us</Nav.Link>
              <Nav.Link href="/contactus" className="me-3 ms-2">Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className='login-container'>
          <Row className="flex-grow-1 align-items-center ">
            <Col lg={7} md={8} className="mx-auto">
              <div className="p-5 login-form">
                <h2 className="mb-5 heading-login">Login</h2>
                <Form onSubmit={handleLogin}>
                  <Row>
                    <Col sm={6} className="mb-3">
                      <Form.Group className="mb-5 position-relative icon-inside-input" controlId="formBasicEmail">
                        <Form.Control type="username" placeholder="Username" className="input-with-icon"
                          value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faUser} className="icon-position" />
                      </Form.Group>
                      <Form.Group className="mb-3 position-relative icon-inside-input" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" className="input-with-icon"
                          value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faLock} className="icon-position" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className='login-button'>
                    <Button type='submit' size="lg" className="w-50 mb-2 button-color">
                      Login
                    </Button>
                  </div>
                  <div className='login-forgot-password'>
                    <Form.Text className="d-block">
                      <a href="/forgotpassword" className='forgotpassword'>Forgot password?</a>
                    </Form.Text>
                  </div>
                </Form>
              </div>
            </Col>
            <Col lg={5} md={4}>
              <Image src={illustrationImage} alt="Boy Reading a Book" className="img-fluid boy-read-book" />
            </Col>
          </Row>
        </div>

        <Container fluid className="pt-4 pb-3 container-fluid">
          <Row className="my-4 text-center services-background">
            <h2>Our services</h2>
            <Col className="service-col" md={3}>
              <div className="service-icon">
                <Book className="large-icon" />
              </div>
              <h5>Offline Reading Lounge</h5>
              <p>Step into our tranquil lounge, home to thousands of books, cozy nooks, and the perfect atmosphere for hours of uninterrupted reading pleasure.</p>
            </Col>
            <Col className="service-col" md={3}>
              <div className="service-icon">
                <Journal className="large-icon" />
              </div>
              <h5>Research and Reference Support</h5>
              <p>Access a world of knowledge with our digital library, featuring a vast array of e-books, online publications, and databases available 24/7 from any device.</p>
            </Col>
            <Col className="service-col" md={3}>
              <div className="service-icon">
                <PcDisplay className="large-icon" />
              </div>
              <h5>Interactive Learning Programs</h5>
              <p>Experience engaging learning through our interactive programs, including educational workshops, author talks, and community activities designed to inspire and connect.</p>
            </Col>
            <Col className="service-col" md={3}>
              <div className="service-icon">
                <CloudArrowDown className="large-icon" />
              </div>
              <h5>Digital Library Access</h5>
              <p>Benefit from personalized research support with our skilled librarians ready to assist you in finding resources, references, and data for any inquiry or project.</p>
            </Col>
          </Row>
        </Container>

        {/* call component  */}
        <BooksImages />
        <Footer />

        <div className="copy-right fixed-bottom">
          <div className="copyright">
            <div className="row">
              <div className="col-lg-6">
                <span className="mt-1 text-size ms-3">@Copyright Rajaram Library</span>
              </div>
              <div className="col-lg-6 text-lg-end">
                <span className="mt-1 text-size ms-2 me-3">Developed By Enbee Systems, 9881888180</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;