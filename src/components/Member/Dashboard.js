/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Col, Container, Form, Table } from 'react-bootstrap';

const Dashboard = () => {
    // auth
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    // state
    const [bookIssue, setBookIssue] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [memberBookInfo, setMemberBookInfo] = useState([]);

    // fetch book issue
    const fetchIssue = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/issueReturns`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching book issue: ${response.statusText}`);
            }
            const data = await response.json();
            setBookIssue(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching book issue. Please try again later.');
        }
    };

    useEffect(() => {
        fetchIssue();
    }, []);

    // fetch member book info
    useEffect(() => {
        const fetchMemberBookInfo = async () => {
            try {
                if (selectedMemberId) {
                    const response = await fetch(`${BaseURL}/api/general-members/memberBookInfo/${selectedMemberId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`Error fetching member book info: ${response.statusText}`);
                    }
                    const data = await response.json();
                    setMemberBookInfo(data);
                }
            } catch (error) {
                console.error(error);
                toast.error('Error fetching member book info. Please try again later.');
            }
        };

        fetchMemberBookInfo();
    }, [selectedMemberId, accessToken, BaseURL]);

    // handle username change
    const handleUsernameChange = (e) => {
        setSelectedMemberId(e.target.value);
    };

    return (
        <div className="main-content">

            <Form.Group as={Col}>
            <Form.Label className="fw-bold">Member Name</Form.Label>
                <Form.Control
                    as="select"
                    className="small-input border"
                    value={selectedMemberId}
                    onChange={handleUsernameChange}
                >
                    <option value="">Select a username</option>
                    {bookIssue.map(username => (
                        <option key={username.username} value={username.username}>
                            {username.username}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Container className='small-screen-table'>
                <div className='mt-3'>
                    <div className="table-responsive table-height">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Book Name</th>
                                    <th>Copy No.</th>
                                    <th>Issue Date</th>
                                    <th>Return Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberBookInfo.map((book, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{book.bookName}</td>
                                        <td>{book.purchaseCopyNo}</td>
                                        <td>{book.issueDate}</td>
                                        {/* <td>{book.returnDate ? book.book_return : "Not returned"}</td> */}
                                        <td>{book.returnDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="pagination-container">
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Dashboard;
