import React, { useState } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { Download, Printer } from 'react-bootstrap-icons';
import { useAuth } from '../../../Auth/AuthProvider';

const AccessionStatus = () => {
    const { accessToken } = useAuth();
    const [show, setShow] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const BaseURL = process.env.REACT_APP_BASE_URL;

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setBlobUrl(null);
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {    
            const response = await fetch(`${BaseURL}/api/reports/acession-status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({})
            });
    
            if (!response.ok) {
                if (response.status === 500) {
                    setBlobUrl('error-500');
                } else {
                    setBlobUrl('error');
                }
                throw new Error('Network response was not ok');
            }
    
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
        setIsLoading(false);
    };
    

    const handleDownloadPDF = () => {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'acession-status-report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        const printWindow = window.open(blobUrl, '_blank', 'top=0,left=0,height=100%,width=auto');
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div>
            <div className="overlay mt-5">
                <div className="centered-form">
                    <Container>
                        <div className="form-header">
                            <h2 className="text-primary">Accession Status Report</h2>
                        </div>
                        <div className="mt-5 text-center">
                            <p className="lead">Click below to generate the accession status report.</p>
                        </div>
                        <div className='d-flex justify-content-center mt-4'>
                            <Button className='button-color' onClick={() => { fetchData(); handleShow(); }}>
                                {isLoading ? 'Generating...' : 'Generate Report'}
                            </Button>
                        </div>
                    </Container>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="flex-grow-1">Accession Status</Modal.Title>
                    {blobUrl && !blobUrl.includes('error') && (
                        <>
                            <Button variant="info" onClick={handleDownloadPDF} className="me-2">
                                <Download /> Download PDF
                            </Button>
                            <Button variant="primary" onClick={handlePrint} className="me-2">
                                <Printer /> Print
                            </Button>
                        </>
                    )}
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <p>Loading PDF... Please wait.</p>
                    ) : blobUrl?.includes('error') ? (
                        <p>Error loading PDF. Please try again or contact support.</p>
                    ) : (
                        <embed src={blobUrl} type="application/pdf" width="100%" height="500px" />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AccessionStatus;
