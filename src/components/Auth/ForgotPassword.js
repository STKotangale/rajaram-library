import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Button, Image, FormGroup } from 'react-bootstrap';
import logoImage from '../../assets/rajalib.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './AuthCSS/LoginPage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userVerified, setUserVerified] = useState(false);
  const [userId, setUserId] = useState(null); // New state to store userId

  const navigate = useNavigate();
  const BaseURL = process.env.REACT_APP_BASE_URL;

  // Mail and mobile verify
  const handleSubmitContactInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BaseURL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mobile }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.message === "User found") {
        toast.success('User found.');
        setUserVerified(true); // Set user verified to true to show password reset fields
        setUserId(data.userId); // Store userId for the next API call
      } else {
        toast.warning('User not found.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Reset password
  const handleSubmitPasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.error("New password and confirm password do not match");
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      const response = await fetch(`${BaseURL}/api/general-members/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password: newPassword, confirmPassword }),
      });

      if (response.ok) {
        toast.success('Password changed successfully.');
        navigate('/');
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className='main-forgot-password-page'>
      <Container fluid className="min-vh-100 d-flex flex-column forgot-password-page">
        <Navbar bg="white" expand="lg" className="w-100">
          <Navbar.Brand href="#home">
            <Image src={logoImage} alt="Library Logo" height="60" />
            <span className="h4 ms-4">Rajaram Library</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className="me-3" href="/">Home</Nav.Link>
              <Nav.Link className="me-3" href="/aboutus">About Us</Nav.Link>
              <Nav.Link className="me-3" href="/contactus">Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className='forgot-password'>
          <Row className="w-100 d-flex justify-content-center">
            <Col xs={12} md={6} lg={5}>
              <div className="forgot-container p-5 shadow rounded">
                <h2>Forgot Password</h2>
                {!userVerified ? (
                  <Form onSubmit={handleSubmitContactInfo}>
                    <FormGroup className='mt-4'>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email address"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup className='mt-4'>
                      <Form.Label>Mobile</Form.Label>
                      <Form.Control
                        type="text"
                        name="mobile"
                        placeholder="Mobile number"
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </FormGroup>
                    <div className="d-flex justify-content-end mt-3">
                      <Button type="button" variant="secondary" className="me-2" onClick={handleCancel}>Cancel</Button>
                      <Button type="submit" className='button-color' variant="primary">Submit</Button>
                    </div>
                  </Form>
                ) : (
                  <Form onSubmit={handleSubmitPasswordReset}>
                    <FormGroup className='mt-4'>
                      <Form.Label>Reset Password for {email || mobile}</Form.Label>
                    </FormGroup>

                    <FormGroup className='mt-4'>
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        placeholder="Password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </FormGroup>

                    <FormGroup className='mt-4'>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </FormGroup>

                    <div className="d-flex justify-content-end mt-3">
                      <Button type="button" variant="secondary" className="me-2" onClick={handleCancel}>Cancel</Button>
                      <Button type="submit" className='button-color'>Submit</Button>
                    </div>
                  </Form>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPassword;
