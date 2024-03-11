import React, { useState } from 'react';
import { NavLink} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'


function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        errorMessage: '',
        successMessage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        console.log(formData); 
        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setFormData({
                ...formData,
                errorMessage: 'Password must be at least 8 characters long and contain symbols',
                successMessage: ''
            });
            return;
        }
    
        // Check if password and confirm password match
        if (formData.password !== formData.confirmPassword) {
            setFormData({
                ...formData,
                errorMessage: 'Password and confirm password do not match',
                successMessage: ''
            });
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                const data = await response.json();
                if (data && data.message) {
                    setFormData({
                        ...formData,
                        errorMessage: data.message,
                        successMessage: ''
                    });
                } else {
                    throw new Error('Failed to register user');
                }
                return;
            }
    
            const data = await response.json();
            console.log(data); // Handle successful response from the backend
    
            // Clear form fields after successful registration
            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                errorMessage: '',
                successMessage: 'User registered successfully'
            });
    
            // Redirect the user to the login page after successful registration
            navigate('/login')
        } catch (error) {
            console.error('Error:', error);
            // Handle errors
            setFormData({
                ...formData,
                errorMessage: 'Failed to register user',
                successMessage: ''
            });
        }
    };
    

    return (
        <div>
            <Navbar/>
        <div className='container mt-5'>
            <div className="row">
                <div className='col-12 col-md-7 col-sm-6'>
                    <h1>Welcome</h1>
                </div>
                <div className='col-12 col-md-5 col-sm-6'>
                    <form onSubmit={handleSubmit}>
                        {formData.errorMessage && <div className="alert alert-danger">{formData.errorMessage}</div>}
                        {formData.successMessage && <div className="alert alert-success">{formData.successMessage}</div>}
                        <div className="form-group">
                            <label htmlFor="firstName">Firstname</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="firstName" 
                                placeholder="Enter Firstname" 
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Lastname</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="lastName" 
                                placeholder="Enter Lastname" 
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                placeholder="Enter Email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phonenumber</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="phone" 
                                placeholder="Enter Phonenumber" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                placeholder="Password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="confirmPassword" 
                                placeholder="Confirm Password" 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                       <button type="submit" className="btn btn-primary">Submit</button><br/><br/>
                        <NavLink to='/login'>Already Registered, then Login here!</NavLink>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Register;
