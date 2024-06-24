/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Auth/AuthProvider';
import { Download, Printer } from 'react-bootstrap-icons';
import '../CSS/Report.css';

// Utility function to format date to dd-mm-yyyy
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const IssueRegisterMemberWise = () => {

    const [generalMember, setGeneralMember] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchGeneralMembers();
    }, [accessToken]);

    // Fetch general members from the API
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
            setGeneralMember(data.data.map(member => ({
                ...member,
                fullName: `${member.firstName} ${member.middleName} ${member.lastName}`
            })));
        } catch (error) {
            console.error("Failed to fetch general members:", error);
            toast.error('Failed to load general members. Please try again later.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedFullName = generalMember.find(m => m.memberId === parseInt(selectedMember, 10))?.fullName || '';
        const reportData = {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            fullName: selectedFullName,
        };
        setIsLoading(true);
        try {
            const response = await fetch(`${BaseURL}/api/reports/issue-member-wise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(reportData),
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setShowModal(true);
            } else {
                toast.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error submitting report');
        }
        setIsLoading(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
    };

    const handleDownloadPDF = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'issue-member-report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        const printWindow = window.open(pdfUrl, '_blank', 'top=0,left=0,height=100%,width=auto');
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className='member-report'>
            <div className="overlay">
                <div className="centered-form">
                    <Container>
                        <div className="form-header">
                            <h2>Issue Register Member Wise Report</h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        list="memberNameList"
                                        placeholder="Enter or select a member"
                                    />
                                    <datalist id="memberNameList">
                                        {generalMember.map(member => (
                                            <option key={member.memberId} value={member.fullName}>
                                                {member.fullName}
                                            </option>
                                        ))}
                                    </datalist>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <div className='d-flex justify-content-end'>
                                <Button type="submit" className='button-color' disabled={isLoading}>
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </Form>
                    </Container>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Issue Member Wise Report</Modal.Title>
                    <Button variant="info" onClick={handleDownloadPDF}>
                        <Download /> Download PDF
                    </Button>
                    <Button variant="primary" onClick={handlePrint}>
                        <Printer /> Print
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <p>Loading PDF... Please wait.</p>
                    ) : pdfUrl ? (
                        <embed src={pdfUrl} type="application/pdf" width="100%" height="500px" />
                    ) : (
                        <p>Error loading PDF. Please try again or contact support.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default IssueRegisterMemberWise;
