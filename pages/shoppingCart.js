import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]); // Cart items state

  // Load cart items from sessionStorage
  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Handle removing an item from the cart
  const handleRemove = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove); // Remove the item by index
    setCart(updatedCart); // Update local cart state
    sessionStorage.setItem('cart', JSON.stringify(updatedCart)); // Update sessionStorage
  };

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.split(' ')[0]); // Extract numeric price from string
    return !isNaN(price) ? sum + price : sum; // Skip invalid prices
  }, 0);

  // Handle checkout
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart, email: '' }), // Include email in the body
      });

      if (response.ok) {
        alert('Order placed successfully!');
        setCart([]); // Clear the local cart
        sessionStorage.removeItem('cart'); // Clear the cart in sessionStorage
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          {cart.map((item, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid grey',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              
              <div>
                <Typography variant="h6">{item.pname}</Typography>
                <Typography variant="subtitle1">Price: {item.price}</Typography>
                <img src={item.image} alt={item.pname} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }} />
              </div>
              <Button
                onClick={() => handleRemove(index)}
                variant="outlined"
                color="secondary"
              >
                Remove
              </Button>
            </Box>
          ))}

          {/* Display total price */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: {totalPrice.toFixed(2)} euro
          </Typography>

          <Button
            onClick={handleCheckout}
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
          >
            Checkout
          </Button>
        </>
      )}
    </Box>
  );
};

export default ShoppingCart;
