import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Avatar, TextField, Button, Typography, Link} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { toast } from 'react-toastify';


const Login = ({ handleChange }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const paperStyle = { padding: 20, height: '60vh', width: 280, margin: "20px auto" };
    const avatarStyle = { backgroundColor: '#1bbd7e' };
    const btnstyle = { margin: '8px 0' };

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
            navigate('/homepage');
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message);

        }
    };

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <form onSubmit={handleLogin}>
                    <TextField label='Username' placeholder='Enter username' fullWidth required
                        value={username} onChange={(e) => setUsername(e.target.value)}
                    />
                    <div style={{ margin: '10px 0' }} />

                    <TextField label='Password' placeholder='Enter password' type='password' fullWidth required 
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <div style={{ margin: '20px 0' }} />

                    <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Log in</Button>
                </form>
                <Typography>
                    <Link href="#" >
                        Forgot password?
                    </Link>
                </Typography>
                <div style={{ margin: '30px 0' }} />

                <Typography> Do you have an account?
                    <Link href="#" onClick={() => handleChange("event", 1)} >
                        Sign Up
                    </Link>
                </Typography>

            </Paper>
        </Grid>
    );
};

export default Login;
