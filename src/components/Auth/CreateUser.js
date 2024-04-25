import React, { useState } from 'react';
import { PersonCircle, LockFill, BoxArrowRight } from 'react-bootstrap-icons';
import { Container, Button, Form } from 'react-bootstrap';
import './AuthCSS/CreateUser.css';

const CreateUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/signup/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                // Handle success, maybe redirect or show a success message
                console.log('User created successfully');
            } else {
                // Handle error, maybe show an error message
                console.error('Failed to create user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container className="create-user-container w-50 mt-5">
            <div className="border p-5">
                <h2 className="mb-4">Create User</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                            <PersonCircle className="me-2" /> Username
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                            <LockFill className="me-2" /> Email
                        </Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                            <BoxArrowRight className="me-2" /> Password
                        </Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className='d-flex justify-content-end'>
                        <Button type='submit' className="w-40 mb-2 button-color">
                            Create User
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default CreateUser;
