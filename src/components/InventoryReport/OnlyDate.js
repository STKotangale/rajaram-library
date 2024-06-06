
import React, { useState } from 'react';
import { Container, Modal, Button, Form, Row, Col } from 'react-bootstrap';

const OnlyDate = () => {

    //add 
    const [showAddModal, setShowAddModal] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');



    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-3 d-flex justify-content-between'>
                    <Button onClick={() => setShowAddModal(true)} className="button-color">
                        Report
                    </Button>
                </div>


                {/* add modal */}
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Report Format</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="custom-date-picker small-input"
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
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>

                        </Form>
                    </Modal.Body>
                </Modal>

            </Container>
        </div >

    );
};

export default OnlyDate;
