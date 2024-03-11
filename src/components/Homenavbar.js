import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Homenavbar() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchCartItems();
    fetchUserProfile();
    const storedSubscriptionSuccess = localStorage.getItem('subscriptionSuccess');
    if (storedSubscriptionSuccess === 'true') {
      setSubscriptionSuccess(true);
    }
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCartItems(response.data.cart_items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.product_price * item.quantity;
    });
    setTotalPrice(total);
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const userId = userDetails ? userDetails.id : null;
      if (!userId) {
        console.error('User ID not found.');
        return;
      }
      await axios.post('http://localhost:5000/subscriptions', {
        user_id: userId,
        card_name: cardName,
        card_number: cardNumber,
        card_exp_month: cardExpMonth,
        card_exp_year: cardExpYear,
        card_cvv: cardCvv
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCardName('');
      setCardNumber('');
      setCardExpMonth('');
      setCardExpYear('');
      setCardCvv('');
      setSubscriptionSuccess(true);
      localStorage.setItem('subscriptionSuccess', true);
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('subscriptionSuccess'); // Remove subscriptionSuccess from localStorage
    setSubscriptionSuccess(true); // Reset subscriptionSuccess state
    navigate('/login');
  };
  

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/cart/${cartItemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleIncrement = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity += 1;
    setCartItems(updatedCartItems);
  };

  const handleDecrement = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity -= 1;
      setCartItems(updatedCartItems);
    }
  };
  

  return (
    <div>
      <nav className="mb-4 navbar navbar-expand-lg navbar-dark bg-unique" style={{color:'white'}}>
        <NavLink className="navbar-brand" to="/landing">Ecommerce</NavLink> 
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-3" aria-controls="navbarSupportedContent-3" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent-3">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/landing">Home <span className="sr-only">(current)</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/checkoutdetails">Orders</NavLink>
            </li>
            {!subscriptionSuccess && (
              <li className="nav-item">
                <button className="btn btn-outline" style={{color:'white'}} type="button" data-toggle="modal" data-target="#subscriptionModal">
                  Subscribe
                </button>
              </li>
            )}
            {subscriptionSuccess && (
              <li className="nav-item dropdown active">
                <NavLink className="nav-link dropdown-toggle" id="navbarDropdownMenuLink-3" to="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Seller</NavLink>
                <div className="dropdown-menu dropdown-menu-right dropdown-unique" aria-labelledby="navbarDropdownMenuLink-3">
                  <NavLink className="dropdown-item" to="/addproducts">Add product</NavLink>
                  <NavLink className="dropdown-item" to="#">My product</NavLink>
                  <NavLink className="dropdown-item" to="#">My orders</NavLink>
                </div>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ml-auto nav-flex-icons">
            <li className="nav-item">
              <a className="nav-link waves-effect waves-light"><i className="fa-regular fa-comment"></i></a>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline" style={{color:'white'}} type="submit" data-toggle="modal" data-target="#cartModal">
                <i className="bi-cart-fill me-1"></i>
                Cart
                <span className="badge bg-dark text-white ms-1 rounded-pill">{cartItems.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <a className="nav-link waves-effect waves-light"><span className="material-symbols-outlined">person</span></a>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-user"></i></a>
              <div className="dropdown-menu dropdown-menu-right dropdown-unique" aria-labelledby="navbarDropdownMenuLink">
                <NavLink className="dropdown-item" to="/profile">Profile</NavLink>
                <a className="dropdown-item" onClick={handleLogout}>Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <div className="modal fade" id="cartModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title" id="exampleModalLabel">
                Your Shopping Cart
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <table className="table table-image">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Total</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className="w-25">
                        <img src={`http://localhost:5000/uploads/${item.image_path}`} className="img-fluid img-thumbnail" alt={item.product_name} />
                      </td>
                      <td>{item.product_name}</td>
                      <td>${item.product_price}</td>
                      <td className="qty">
                        <input type="text" className="form-control mx-2" id={`input${index}`} value={item.quantity} readOnly />
                        <button className="btn btn-sm btn-secondary" style={{ marginTop: '10PX' }} onClick={() => handleIncrement(index)}>+</button>&nbsp;&nbsp;
                        <button className="btn btn-sm btn-secondary" style={{ marginTop: '10PX' }} onClick={() => handleDecrement(index)}>-</button>
                      </td>
                      <td>${item.product_price * item.quantity}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-end">
                <h5>Total: <span className="price text-success">${totalPrice}</span></h5>
              </div>
            </div>
            <div className="modal-footer border-top-0 d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-success" onClick={()=>navigate('/checkout')}>Checkout</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="subscriptionModal" tabIndex="-1" role="dialog" aria-labelledby="subscriptionModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="subscriptionModalLabel">Subscribe Now</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={handleSubscriptionSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="cardName">Cardholder Name</label>
                  <input type="text" className="form-control" id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input type="text" className="form-control" id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="cardExpMonth">Expiration Month</label>
                    <input type="text" className="form-control" id="cardExpMonth" min='1' and max='12' value={cardExpMonth} onChange={(e) => setCardExpMonth(e.target.value)} required />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="cardExpYear">Expiration Year</label>
                    <input type="text" className="form-control" id="cardExpYear" value={cardExpYear} onChange={(e) => setCardExpYear(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cardCvv">CVV</label>
                  <input type="text" className="form-control" id="cardCvv" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homenavbar;
