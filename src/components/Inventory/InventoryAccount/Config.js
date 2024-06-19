/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthProvider';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Config = () => {
    //get
    const [config, setConfig] = useState([]);
    //auth
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;
    // update 
    const [showModal, setShowModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);

    //get api
    const fetchConfig = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/config`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching Ccnfig: ${response.statusText}`);
            }
            const data = await response.json();
            setConfig(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching Config. Please try again later.');
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);



    // // Open modal and set selected fee
    // const handleUpdateClick = (fee) => {
    //     setSelectedFee(fee);
    //     setShowModal(true);
    // };

    // Handle form submission update
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/fees/${selectedFee.feesId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedFee)
            });
            if (!response.ok) {
                throw new Error(`Error updating config: ${response.statusText}`);
            }
            toast.success('Config updated successfully!');
            fetchConfig(); 
            setShowModal(false);
        } catch (error) {
            console.error(error);
            toast.error('Error updating Config. Please try again later.');
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedFee({ ...selectedFee, [name]: value });
    };

    return (
        <div className='padding-class'>
            <div className="main-content">
                <Container className='small-screen-table'>
                    <div>
                        <div className='table-responsive mt-3 table-height'>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Fees Type</th>
                                        <th>Amount</th>
                                        {/* <th>Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {config.map((fee, index) => (
                                        <tr key={fee.feesId}>
                                            <td>{index + 1}</td>
                                            <td>{fee.bookDays}</td>
                                            <td>{fee.finePerDays}</td>
                                            {/* <td>
                                                <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleUpdateClick(fee)} />
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Container>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Library Fee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFee && (
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formFeesName">
                                <Form.Label>Fees Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="feesName"
                                    value={selectedFee.feesName}
                                    onChange={handleInputChange}
                                    readOnly
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formFeesAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="feesAmount"
                                    value={selectedFee.feesAmount}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <div className='d-flex justify-content-end mt-2'>
                            <Button className='button-color' type="submit">
                                Update
                            </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Config;
