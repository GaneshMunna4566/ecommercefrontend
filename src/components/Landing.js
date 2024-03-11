import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/main.css';
import '../css/landing.css';
import Homenavbar from './Homenavbar';
import axios from 'axios';

// Define getUserIdFromToken function
const getUserIdFromToken = (token) => {
  // Logic to extract user_id from token
};

function Landing() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track selected product
  const token = localStorage.getItem('authToken');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/all_products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const userId = getUserIdFromToken(token); // Call getUserIdFromToken function
      const quantity = 1;
      const amount = 10;
      await axios.post('http://localhost:5000/add_to_cart', {
        user_id: userId, // Send user_id instead of email
        product_id: productId,
        quantity,
        amount
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Product added to cart successfully');
      navigate('/landing');
      window.location.reload();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  return (
    <div>
      <Homenavbar />
      <header className="bg-dark py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="text-center text-white">
            <h1 className="display-4 fw-bolder">Shop in style</h1>
            <p className="lead fw-normal text-white-50 mb-0">With this shop homepage template</p>
          </div>
        </div>
      </header>
      <section className="py-5">
        <div className="container px-4 px-lg-5 mt-5">
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {products.map((product, index) => (
              <div key={index} className="col mb-5">
                <div className="card">
                  <img className="card-img-top" src={`http://localhost:5000/uploads/${product.image_path}`} alt="..." />
                  <div className="card-body p-4">
                    <div className="text-center">
                      <h5 className="fw-bolder">{product.product_name}</h5>
                      {product.product_details}<br/>
                      ${product.product_price}
                    </div>
                      <button className="btn btn-outline-dark mt-auto" onClick={() => addToCart(product.id)} >Add to cart</button>
                      <button className="btn btn-outline-dark mt-auto" onClick={() => openModal(product)}>View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-5 bg-dark">
        <div className="container"><p className="m-0 text-center text-white">Ecommerce</p></div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProduct.product_name}</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <img src={`http://localhost:5000/uploads/${selectedProduct.image_path}`} alt={selectedProduct.product_name} />
                <p>{selectedProduct.product_details}</p>
                <p>${selectedProduct.product_price}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
