import React, { useState } from 'react';
import Navbar from './Navbar'

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/reset_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('Password reset email sent. Please check your inbox.');
            } else {
                const data = await response.json();
                setMessage(data.message || 'Failed to send password reset email.');
            }
        } catch (error) {
            setMessage('Failed to send password reset email.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar/>
        <div className='container mt-5'>
            <div className="row">
                <div className='col-sm-6 offset-md-3 offset-sm-1'>
                    <form onSubmit={handleSubmit}>
                        {message && <div className="alert alert-success">{message}</div>}
                        <div className="form-group">
                            <label htmlFor="Email">Email address</label>
                            <input
                                type="email"
                                value={email}
                                className="form-control"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
        </div>

    );
};

export default ResetPasswordPage;
