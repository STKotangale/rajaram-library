/* eslint-disable no-unused-vars */
import React from 'react'
import { Grid, Paper, Avatar, Typography, TextField, Button, Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify';

import './Signup.css';

const Signup = ({ handleChange }) => {
    const initialValues = {
        username: '',
        email: '',
        password: '',
    }

    const BaseURL = process.env.REACT_APP_BASE_URL;

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3, "It's too short").required("Required"),
        email: Yup.string().email("Enter valid email").required("Required"),
        password: Yup.string().min(8, "Password minimum length should be 8").required("Required"),
    })

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to sign up');
            }
            setSubmitting(false);
            toast.success(responseData.message || 'User signed up successfully!');
            handleChange("event", 0)
        } catch (error) {
            console.log(error.message);
            setSubmitting(false);
            toast.error(error.message || 'Failed to sign up');
        }
    };


    return (
        <Grid>
            <Paper elevation={10} className="paper-style">
                <Grid align='center'>
                    <Avatar className="avatar-style"><LockOutlinedIcon /></Avatar>
                    <h2 className="header-style">Sign Up</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
                    <div className="margin-top" />
                </Grid>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form className="form-wrapper">
                            <Field as={TextField} fullWidth name="username" label='Username'
                                placeholder="Enter your username" helperText={<ErrorMessage name="username" />} />
                            <div className="helper-text" />

                            <Field as={TextField} fullWidth name="email" label='Email'
                                placeholder="Enter your email" helperText={<ErrorMessage name="email" />} />
                            <div className="helper-text" />

                            <Field as={TextField} fullWidth name='password' type="password"
                                label='Password' placeholder="Enter your password"
                                helperText={<ErrorMessage name="password" />} />
                            <div className="margin-bottom" />

                            <Button type='submit' color='primary' variant="contained"
                                className="btn-style" fullWidth>Sign up</Button>
                        </Form>
                    )}
                </Formik >
            </Paper>

        </Grid>
    )
}

export default Signup;