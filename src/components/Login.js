import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.message);
                return;
            }

            // Clear error message on successful login
            setErrorMessage('');

            // Reset email and password fields
            setEmail('');
            setPassword('');

            const data = await response.json();
            console.log(data); // Handle successful login, e.g., store token in localStorage
            localStorage.setItem('authToken', data.access_token); // Save token in localStorage
            setSuccessMessage(data.message); // Set success message
            navigate('/landing');

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Failed to login');
        }
    };

    return (
        <div>
            <Navbar />
            <div className='container mt-5'>
                <div className="row">
                    <div className='col-sm-6 offset-md-3 offset-sm-1'>
                        <form onSubmit={handleSubmit}>
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                            <div className="form-group">
                                <label htmlFor="Email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="Email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="Password"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button><br /><br />
                            <NavLink to='/signup'>Didn't Register, then register here!</NavLink><br /><br />
                            <NavLink to='/resetpassword'>Forgot password?</NavLink>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Login;
