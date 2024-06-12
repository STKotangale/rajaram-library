/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Auth/AuthProvider';
import '../CSS/Report.css';

const MemberReport = () => {
    const [generalMember, setGeneralMember] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchGeneralMembers();
    }, [username, accessToken]);

    const fetchGeneralMembers = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/general-members`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setGeneralMember(data.data);
        } catch (error) {
            console.error("Failed to fetch general members:", error);
            toast.error('Failed to load general members. Please try again later.');
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const resetFormFields = () => {
        setSelectedMember('');
        setFromDate('');
        setToDate('');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);

        const member = generalMember.find(m => m.memberId === parseInt(selectedMember, 10));
        const reportData = {
            memberName: member ? member.username : '',
            fromDate: formattedFromDate,
            toDate: formattedToDate,
        };

        try {
            const response = await fetch(`${BaseURL}/api/auth/submit-book-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                console.log('Report submitted successfully');
                toast.success('Report submitted successfully.');
                resetFormFields();
            } else {
                console.error('Failed to submit report');
                toast.error('Failed to submit report.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error submitting report. Please try again.');
        }
    };

    return (
        <div className='member-report'>
            <div className="overlay">
                <div className="centered-form">
                    <Container>
                        <div className="form-header">
                            <h2>Report Format</h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Select
                                        as="select"
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        className="small-input"
                                    >
                                        <option value="">Select a member</option>
                                        {generalMember.map(member => (
                                            <option key={member.memberId} value={member.memberId}>
                                                {member.username}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <div className='d-flex justify-content-end'>
                                <Button className='button-color' type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default MemberReport;
