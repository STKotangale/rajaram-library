import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import MapImage from '../../assets/BooksImages/MapImage.jpg'
import { Instagram, Facebook, Twitter } from "react-bootstrap-icons";
import './CommonCSS/AboutContactFooter.css';

const Footer = () => {
    const addressQuery = "Rajaram Sitaram Dixit Library, Sitabardi, Nagpur, 440012";

    const encodedAddress = encodeURIComponent(addressQuery);

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    return (
        <Container fluid className="bg-dark text-light pt-4 pb-3 mt-5 main-footer">
            <Row className="align-items-start heading-center">
                <Col xs={12} md={3} className="px-md-3">
                    <h2 className="rajaram-library">Rajaram Library</h2>
                    <p>Unlock the future of knowledge with our cutting-edge library management system. Explore, discover, and empower your intellectual journey today.</p>
                    <div>
                        {/* <a href="https://instagram.com/yourInstagramUsername" target="_blank" rel="noopener noreferrer">
                            <Instagram className="mx-2" />
                        </a>
                        <a href="https://facebook.com/yourFacebookPage" target="_blank" rel="noopener noreferrer">
                            <Facebook className="mx-2" />
                        </a>
                        <a href="https://twitter.com/yourTwitterHandle" target="_blank" rel="noopener noreferrer">
                            <Twitter className="mx-2" />
                        </a>  */}
                        <Instagram className="mx-2" />
                        <Facebook className="mx-2" />
                        <Twitter className="mx-2" />
                    </div>
                </Col>


                <Col xs={12} md={3} className="px-md-5 mt-3">
                    <h4 className="footer-heading">Links</h4>
                    <ul className="list-unstyled footer-links">
                        <li><a href="#donate" className="footer-link">Donate</a></li>
                        <li><a href="#resources" className="footer-link">Resources</a></li>
                        <li><a href="#support" className="footer-link">Support</a></li>
                        <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
                    </ul>
                </Col>

                <Col xs={12} md={3} className="px-md-5 mt-2 ">
                        <h4 className="footer-heading ">Address</h4>
                        <address>
                            Rajaram Sitaram Dixit Library,<br />
                            Post Office, Near, Main Road, Sitabuldi, Nagpur, Maharashtra 440012
                        </address>
                </Col>

                <Col xs={12} md={3} className="px-md-5 mt-3">
                    <h4 className="footer-heading">Location</h4>
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
                        <img
                            src={MapImage}
                            className="map-thumbnail img-fluid"
                            alt='Map'
                        />
                    </a>
                </Col>
            </Row>
        </Container>
    );
};

export default Footer;
