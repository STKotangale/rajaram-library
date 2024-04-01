import React from 'react'
import { Grid, Paper, Avatar, Typography, TextField, Button } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify';

const Signup = ({ handleChange }) => {

    const paperStyle = { padding: 20, height: '60vh', width: 280, margin: "20px auto" }
    const headerStyle = { margin: 0 }
    const btnstyle = { margin: '8px 0' };
    const avatarStyle = { backgroundColor: '#1bbd7e' }
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
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2 style={headerStyle}>Sign Up</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
                    <div style={{ margin: '10px ' }} />

                </Grid>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form>

                            <Field as={TextField} fullWidth name="username" label='Username'
                                placeholder="Enter your username" helperText={<ErrorMessage name="username" />} />
                            <div style={{ margin: '10px ' }} />

                            <Field as={TextField} fullWidth name="email" label='Email'
                                placeholder="Enter your email" helperText={<ErrorMessage name="email" />} />
                            <div style={{ margin: '10px ' }} />

                            <Field as={TextField} fullWidth name='password' type="password"
                                label='Password' placeholder="Enter your password"
                                helperText={<ErrorMessage name="password" />} />
                                <div style={{ margin: '20px ' }} />
                            <Button type='submit' color='primary' variant="contained"
                                style={btnstyle} fullWidth>Sign up</Button>

                        </Form>
                    )}
                </Formik >
            </Paper>
        </Grid>
    )
}

export default Signup;