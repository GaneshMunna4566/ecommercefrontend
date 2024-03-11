import React, { useState, useEffect } from 'react';
import '../css/checkout.css';
import Homenavbar from './Homenavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userDetails, setUserDetails] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        state: '',
        city: '',
        postalcode: '',
        card_number: '',
        card_exp_month: '',
        card_exp_year: '',
        card_cvv: '',
        total: 0,
    });

    useEffect(() => {
        fetchUserProfile();
        fetchCartItems();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserDetails(response.data);
            setFormData(prevState => ({
                ...prevState,
                address: response.data.address,
                state: response.data.state,
                city: response.data.city,
                postalcode: response.data.postalcode
            }));
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCartItems(response.data.cart_items);
            calculateTotalPrice(response.data.cart_items);
            const productIds = response.data.cart_items.map(item => item.id);
            setFormData(prevState => ({
                ...prevState,
                product_id: productIds
            }));
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const calculateTotalPrice = (items) => {
        let total = 0;
        items.forEach(item => {
            total += parseFloat(item.amount);
        });
        setTotalPrice(total);
        setFormData(prevState => ({
            ...prevState,
            total: total
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://localhost:5000/checkout', {
                ...formData,
                user_id: userDetails.id,
                product_id: cartItems.map(item => item.id),
                amount: totalPrice,
                status: 0
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Checkout successful');
            navigate('/checkoutdetails');
            console.log('Checkout successful:', response.data);
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <>
            <Homenavbar />
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="checkout-form">
                            <h2>Checkout</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address:</label>
                                    <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="state" className="form-label">State:</label>
                                    <input type="text" className="form-control" id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">City:</label>
                                    <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="postalcode" className="form-label">Postal Code:</label>
                                    <input type="text" className="form-control" id="postalcode" name="postalcode" value={formData.postalcode} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="card_number" className="form-label">Card Number:</label>
                                    <input type="text" className="form-control" id="card_number" min={16} name="card_number" value={formData.card_number} onChange={handleInputChange} required />
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="card_exp_month" className="form-label">Expiration Month:</label>
                                        <select className="form-select" id="card_exp_month" name="card_exp_month" value={formData.card_exp_month} onChange={handleInputChange} required>
                                            <option value="">Month</option>
                                            <option value="01">01 - January</option>
                                            <option value="02">02 - February</option>
                                            <option value="03">03 - March</option>
                                            <option value="04">04 - April</option>
                                            <option value="05">05 - May</option>
                                            <option value="06">06 - June</option>
                                            <option value="07">07 - July</option>
                                            <option value="08">08 - August</option>
                                            <option value="09">09 - September</option>
                                            <option value="10">10 - October</option>
                                            <option value="11">11 - November</option>
                                            <option value="12">12 - December</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="card_exp_year" className="form-label">Expiration Year:</label>
                                        <select className="form-select" id="card_exp_year" name="card_exp_year" value={formData.card_exp_year} onChange={handleInputChange} required>
                                            <option value="">Year</option>
                                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="card_cvv" className="form-label">CVV:</label>
                                    <input type="text" className="form-control" id="card_cvv" name="card_cvv" value={formData.card_cvv} onChange={handleInputChange} required />
                                </div>
                                <button type="submit" className="btn btn-primary">Checkout</button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="checkout-summary">
                            <h2>Order Summary</h2>
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <p>{item.product_name}</p>
                                        <p>${item.amount}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="total">
                                <p>Total:</p>
                                <p>${totalPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;
