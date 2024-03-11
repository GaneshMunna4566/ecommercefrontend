import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'


const UpdatePasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) {
            setMessage('');
            setErrorMessage('Reset token not found!');
            return;
        }
    
        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setMessage('');
            setErrorMessage('Password must be at least 8 characters long and contain symbols and numbers.');
            return;
        }
    
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setMessage('');
            setErrorMessage('Passwords do not match.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/update_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the JWT token in the Authorization header
                },
                body: JSON.stringify({ new_password: newPassword }),
            });
            const data = await response.json();
            setMessage(data.message);
            setErrorMessage('');
            
            // Navigate to login page on successful password update
            navigate('/login');
        } catch (error) {
            setMessage('Failed to reset password.');
            setErrorMessage('');
            console.error('Error:', error);
        }
    };
    

    return (
        <div>
            <Navbar/>
        <div className='container mt-5'>
            <div className="row">
                <div className='col-sm-6 offset-md-3 offset-sm-1'>
                    <form onSubmit={handleSubmit}>
                        {message && <div className="message">{message}</div>}
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                className="form-control"
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                className="form-control"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
};

export default UpdatePasswordPage;
