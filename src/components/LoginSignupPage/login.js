import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Avatar, TextField, Button, Typography, Link} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { toast } from 'react-toastify';

import './Login.css';

const Login = ({ handleChange }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const BaseURL = process.env.REACT_APP_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('userInfo', JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                roles: data.roles,
                tokenType: data.tokenType
            }));
            localStorage.setItem('username', data.username);
            localStorage.setItem('accessToken', data.accessToken);
            toast.success("Login successful!");
            navigate('/purchase');
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message);

        }
    };

    return (
        <div className='background-image'>
        <Grid>
        <Paper elevation={10} className="paper-style">
    <Grid align='center'>
        <Avatar className="avatar-style"><LockOutlinedIcon /></Avatar>
        <h2>Sign In</h2>
    </Grid>
    <form onSubmit={handleLogin} className="form-wrapper"> {/* Add the form-wrapper class */}
        <TextField label='Username' placeholder='Enter username' fullWidth required
            value={username} onChange={(e) => setUsername(e.target.value)}
        />
        <div className="margin-bottom" />

        <TextField label='Password' placeholder='Enter password' type='password' fullWidth required 
            value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <div className="margin-bottom" />

        <Button type='submit' color='primary' variant="contained" className="button-style" fullWidth>Log in</Button>
    </form>
    <Typography className="margin-bottom">
        <Link href="#" >
            Forgot password?
        </Link>
    </Typography>
    <Typography> Do you have an account?
        <Link href="#" onClick={() => handleChange("event", 1)} className="link-style">
            Sign Up
        </Link>
    </Typography>
</Paper>


        </Grid>
        </div>
    );
};

export default Login;
