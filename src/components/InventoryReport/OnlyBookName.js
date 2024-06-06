
import React, { useState } from 'react';
import { Container, Modal, Button, Form, Row } from 'react-bootstrap';

const OnlyBookName = () => {

    //add 
    const [showAddModal, setShowAddModal] = useState(false);
    const [bookName, setBookName] = useState('');
   
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
                                <Form.Group className="mb-3" controlId="bookName">
                                    <Form.Label>Book Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Book name"
                                        value={bookName}
                                        onChange={(e) => setBookName(e.target.value)}
                                        required
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

export default OnlyBookName;
