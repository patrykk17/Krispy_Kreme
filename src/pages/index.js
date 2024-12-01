import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LoginPage from './login';
import RegisterPage from './register';
import ShoppingCart from './shoppingCart';

export default function MyApp() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [weather, setWeather] = useState(null); // State for weather data

  // Fetch products and check login status
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/getProducts');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    // Check session status on load
    async function checkSessionStatus() {
      const response = await fetch('/api/getData');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.loggedIn);
        setUserEmail(data.email || '');
      }
    }

    checkSessionStatus();

    // Fetch weather data
    async function fetchWeather() {
      try {
        const res = await fetch('/api/getWeather');
        const data = await res.json();
        setWeather(data.temp);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    }

    fetchWeather(); // Fetch the weather when the page loads
  }, []);

  // Add a product to the cart
  const addToCart = async (product) => {
    const response = await fetch('/api/getData');
    const session = await response.json();

    if (!session.loggedIn) {
      alert('You must be logged in to add items to the cart.');
      setShowLogin(true);
      return;
    }

    const currentCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const updatedCart = [...currentCart, product];
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.pname} added to cart!`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        alert('Logged out successfully!');
        setIsLoggedIn(false);
        setUserEmail('');
        setShowRegister(false); // Close register if open
      } else {
        alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Handle successful login
  const handleLoginSuccess = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setShowLogin(false); // Close login page after successful login
  };

  const toggleLogin = () => {
    setShowLogin((prev) => {
      setShowRegister(false);
      setShowCart(false);
      return !prev;
    });
  };

  const toggleRegister = () => {
    setShowRegister((prev) => {
      setShowLogin(false);
      setShowCart(false);
      return !prev;
    });
  };

  const toggleCart = () => {
    setShowCart((prev) => {
      setShowLogin(false);
      setShowRegister(false);
      return !prev;
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          {isLoggedIn ? (
            <>
              <Typography variant="subtitle1" sx={{ marginRight: 2 }}>
                {`Welcome, ${userEmail}`}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={toggleLogin}>
                {showLogin ? 'Back to Home' : 'Login'}
              </Button>
              <Button color="inherit" onClick={toggleRegister}>
                {showRegister ? 'Back to Home' : 'Register'}
              </Button>
            </>
          )}
          <Button color="inherit" onClick={toggleCart}>
            {showCart ? 'Back to Home' : 'Cart'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="section" sx={{ p: 2 }}>
        {weather && (
          <Box sx={{ p: 2, border: '1px solid grey', borderRadius: '8px', mb: 3 }}>
            <Typography variant="h6">Today's temperature: {weather}°C</Typography>
          </Box>
        )}
        {showLogin && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        {showRegister && !isLoggedIn && <RegisterPage />}
        {showCart && <ShoppingCart />}
        {!showLogin && !showRegister && !showCart && (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Products
            </Typography>
            {loading ? (
              <Typography>Loading products...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : products && products.length > 0 ? (
              products.map((product, i) => (
                <Box key={i} sx={{ mb: 3, p: 2, border: '1px solid grey', borderRadius: '8px' }}>
                  <img
                    src={product.image}
                    alt={product.pname}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                  />
                  <Typography variant="h6">{product.pname}</Typography>
                  <Typography variant="subtitle1">{product.price}</Typography>
                  <Button onClick={() => addToCart(product)} variant="outlined">
                    Add to Cart
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No products available.</Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
