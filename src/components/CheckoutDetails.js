import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Homenavbar from './Homenavbar';

const Orders = () => {
  // State to store orders data
  const [orders, setOrders] = useState([]);

  // Function to fetch orders data from the backend
  const fetchOrders = async () => {
    // Retrieve JWT token from localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('JWT token not found in localStorage');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/orders', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch orders data when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
    <Homenavbar/>
    <div>
      <h2>Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Image</th>
            <th>Product Name</th>
            <th>Product Details</th>
            <th>Product Size</th>
            <th>Product Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                <img src={`http://localhost:5000/uploads/${order.image_path}`} alt={order.product_name} style={{ maxWidth: '100px' }} />
              </td>
              <td>{order.product_name}</td>
              <td>{order.product_details}</td>
              <td>{order.product_size}</td>
              <td>{order.product_price}</td>
              
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </>
  );
};

export default Orders;
