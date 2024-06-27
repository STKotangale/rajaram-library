import React, { useState } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { Download, Printer } from 'react-bootstrap-icons';
import { useAuth } from '../../../Auth/AuthProvider';

const Accession = () => {
  const { accessToken } = useAuth();
  const [show, setShow] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);
  const BaseURL = process.env.REACT_APP_BASE_URL;

  const handleShow = () => {
    setShow(true);
    setError(false); 
    fetchData();
  };

  const handleClose = () => {
    setShow(false);
    setBlobUrl(null);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${BaseURL}/api/reports/acession`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({})
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
        const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(true);
    }
  };
  

  const handleDownloadPDF = () => {
    if (blobUrl) {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'acession-status-report.pdf'; 
      document.body.appendChild(link); 
      link.click();
      document.body.removeChild(link); 
    }
  };

  const handlePrint = () => {
    if (blobUrl) {
      const printWindow = window.open(blobUrl, '_blank', 'top=0,left=0,height=100%,width=auto');
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div>
      <div className="overlay mt-5">
        <div className="centered-form">
          <Container>
            <div className="form-header">
              <h2 className="text-primary">Accession Report</h2>
            </div>
            <div className="mt-5 text-center">
              <p className="lead">Click below to generate the accession report.</p>
            </div>
            <div className='d-flex justify-content-center mt-4'>
              <Button className='button-color' onClick={handleShow}>Generate Report</Button>
            </div>
          </Container>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title className="flex-grow-1">Accession</Modal.Title>
          <Button variant="info" onClick={handleDownloadPDF} className="me-2">
            <Download /> Download PDF
          </Button>
          <Button variant="primary" onClick={handlePrint} className="me-2">
            <Printer /> Print
          </Button>
        </Modal.Header>
        <Modal.Body>
          {error ? (
            <p>Error loading PDF. Please try again or contact support.</p>
          ) : blobUrl ? (
            <embed src={blobUrl} type="application/pdf" width="100%" height="500px" />
          ) : (
            <p>Loading PDF... Please wait.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Accession;
