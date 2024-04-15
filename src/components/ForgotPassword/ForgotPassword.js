import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Button, Image, FormGroup } from 'react-bootstrap';
import logoImage from '../../assets/rajalib.png';


import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Footer from '../MyAboutInfo/Footer';

import './ForgotPassword.css'
const ForgotPassword = () => {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // New state to track whether OTP has been sent

  const navigate = useNavigate();

  const BaseURL = process.env.REACT_APP_BASE_URL;


  // mail verify and send otp
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BaseURL}/verifyAndSendOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.message === "OTP sent successfully") {
        setOtpVerified(true);
        setOtpSent(true);
        toast.success('OTP sent successfully for owner.');
      }
      else {
        toast.warning('User not found?');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BaseURL}/validateOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      if (response.ok) {
        // Handle response OK
      } else {
        // Handle response not OK
      }
      setOtpValid(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while validating OTPs. Please try again.');
      setOtpValid(false);
    }
  };

  // reset password
  const handleSubmitPasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.error("New password and confirm password do not match");
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      const response = await fetch(`${BaseURL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      if (response.ok) {
        // Handle response1 OK
      } else {
        // Handle response1 not OK
      }
      // navigate('/login');
    } catch (error) {
      console.error('Error:', error);
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
              <Nav.Link className="me-3"href="/aboutus">About Us</Nav.Link>
              <Nav.Link className="me-3" href="/contactus">Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className='forgot-password'>
          <Row className="w-100 d-flex justify-content-center">
            <Col xs={12} md={6} lg={5}>
              <div className="forgot-container p-5 shadow rounded">
                <h2>Forgot Password</h2>
                {!otpVerified ? (
                  <Form onSubmit={handleSubmitEmail}>
                    <FormGroup className='mt-4'>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email address"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </FormGroup>
                    <div className="d-flex justify-content-end mt-3">
                      <Button type="button" variant="secondary" className="me-2" onClick={handleCancel}>Cancel</Button>
                      <Button className='button-color' variant="primary">Submit</Button>
                    </div>
                  </Form>
                ) : (
                  <Form onSubmit={!otpValid ? handleSubmitOTP : handleSubmitPasswordReset}>
                    {!otpValid && (
                      <FormGroup>
                        <Form.Label>Enter OTP</Form.Label>
                        <Form.Control
                          type="text"
                          name="otp"
                          id="otp"
                          placeholder="######"
                          maxLength="6"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        {!otpValid && otpSent && (
                          <Button color="link" className="resend-btn" onClick={handleSubmitEmail}>
                            Resend OTP
                          </Button>
                        )}
                      </FormGroup>
                    )}

                    {otpValid &&
                      <>
                        <FormGroup>
                          <Form.Label>Reset Password Email</Form.Label>
                          <Form.Control
                            type="text"
                            name="resetPasswordMessage"
                            id="resetPasswordMessage"
                            value={`${email}`}
                          // plaintext
                          // readOnly
                          />
                        </FormGroup>

                        <FormGroup>
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

                        <FormGroup>
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
                      </>
                    }
                    <div className="d-flex justify-content-end mt-3">
                      <Button type="button" variant="secondary" className="me-2" onClick={handleCancel}>Cancel</Button>
                      <Button type="submit" className='button-color'>{!otpValid ? "Validate OTP" : "Submit"}</Button>
                    </div>
                  </Form>
                )}
              </div>
            </Col>
          </Row>
        </div>
        {/* <div className='footer-forgot-page'>
          <Footer />
        </div> */}
      </Container>
    </div >
  )
}

export default ForgotPassword;
