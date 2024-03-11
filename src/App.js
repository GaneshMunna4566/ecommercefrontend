import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';
import UpdatePasswordPage from './components/UpdatePasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage ';
import Landing from './components/Landing';
import Profile from './components/Profile';
import Homenavbar from './components/Homenavbar';
import Addproducts from './components/AddProductForm';
import Checkout from './components/Checkout';
import CheckoutDetails from './components/CheckoutDetails';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/updatepassword" element={<UpdatePasswordPage />} />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/hnavbar" element={<Homenavbar/>} />
          <Route path="/addproducts" element={<Addproducts/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/checkoutdetails" element={<CheckoutDetails/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
