import React, { useState, useEffect } from 'react';
import Homenavbar from './Homenavbar';
import axios from 'axios';

function Addproducts() {
  const [productData, setProductData] = useState({
    product_name: '',
    product_details: '',
    product_size: '',
    product_price: '',
    product_image: null  
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // Flag to track whether update or add operation

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('JWT token is missing');
        return;
      }
      
      const response = await axios.get('http://localhost:5000/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, product_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('JWT token is missing');
        setErrorMessage('JWT token is missing');
        return;
      }
      
      const formData = new FormData();
      formData.append('product_name', productData.product_name);
      formData.append('product_details', productData.product_details);
      formData.append('product_size', productData.product_size);
      formData.append('product_price', productData.product_price);
      formData.append('product_image', productData.product_image);

      let response;
      if (isUpdating) {
        response = await axios.put(`http://localhost:5000/update_product/${selectedProduct.id}`, formData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
          }
        });
      } else {
        response = await axios.post('http://localhost:5000/add_product', formData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
          }
        });
      }
      
      console.log(response.data);
      if (isUpdating) {
        setSuccessMessage('Product updated successfully');
      } else {
        setSuccessMessage('Product added successfully');
      }
      setErrorMessage('');
      fetchProducts();
      setShowUpdateModal(false);
      setIsUpdating(false);
    } catch (error) {
      console.error('Error:', error);
      if (isUpdating) {
        setErrorMessage('Failed to update product');
      } else {
        setErrorMessage('Failed to add product');
      }
      setSuccessMessage('');
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('JWT token is missing');
        setErrorMessage('JWT token is missing');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/delete_product/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log(response.data);
      setSuccessMessage('Product deleted successfully');
      setErrorMessage('');
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to delete product');
      setSuccessMessage('');
    }
  };

  const handleShowUpdateModal = (product) => {
    setSelectedProduct(product);
    setProductData({
      product_name: product.product_name,
      product_details: product.product_details,
      product_size: product.product_size,
      product_price: product.product_price,
      product_image: null
    });
    setShowUpdateModal(true);
    setIsUpdating(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setIsUpdating(false);
  };

  return (
    <div>
      <Homenavbar />
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="productName">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  name="product_name" value={productData.product_name} onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="productDetails">Product Details</label>
                <textarea
                  className="form-control"
                  id="productDetails"
                  rows="3"
                  name="product_details" value={productData.product_details} onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="productSize">Product Size</label>
                <input
                  type="text"
                  className="form-control"
                  id="productSize"
                  name="product_size" value={productData.product_size} onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="productPrice">Product Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="productPrice"
                  name="product_price" value={productData.product_price} onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="productImage">Product Image</label>
                <input
                  type="file"
                  className="form-control-file"
                  id="productImage"
                  name="product_image" onChange={handleImageChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">{isUpdating ? 'Update Product' : 'Add Product'}</button>
            </form>
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">Product Details</th>
                  <th scope="col">Product Size</th>
                  <th scope="col">Product Price</th>
                  <th scope="col">Product Image</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.product_name}</td>
                    <td>{product.product_details}</td>
                    <td>{product.product_size}</td>
                    <td>{product.product_price}</td>
                    <td><img style={{width:'50px',height:'50px'}} src={`http://localhost:5000/uploads/${product.image_path}`} alt="Product Image" /></td>
                    <td>
                      <button className="btn btn-danger mr-2" onClick={() => handleDelete(product.id)}>Delete</button>
                      <button className="btn btn-primary" onClick={() => handleShowUpdateModal(product)}>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showUpdateModal && (
        <div className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Product</h5>
                <button type="button" className="close" onClick={handleCloseUpdateModal} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="updateProductName">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="updateProductName"
                      name="product_name" value={productData.product_name} onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="updateProductDetails">Product Details</label>
                    <textarea
                      className="form-control"
                      id="updateProductDetails"
                      rows="3"
                      name="product_details" value={productData.product_details} onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="updateProductSize">Product Size</label>
                    <input
                      type="text"
                      className="form-control"
                      id="updateProductSize"
                      name="product_size" value={productData.product_size} onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="updateProductPrice">Product Price</label>
                    <input
                      type="number"
                      className="form-control"
                      id="updateProductPrice"
                      name="product_price" value={productData.product_price} onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="updateProductImage">Product Image</label>
                    <input
                      type="file"
                      className="form-control-file"
                      id="updateProductImage"
                      name="product_image" onChange={handleImageChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Product</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Addproducts;
