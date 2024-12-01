import React, { useState, useEffect } from 'react';

export default function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Check if the user is a manager
        const sessionResponse = await fetch('/api/getData');
        const sessionData = await sessionResponse.json();

        if (!sessionData.loggedIn || sessionData.acc_type !== 'manager') {
          alert('Access denied. You must be a manager to view this page.');
          window.location.href = '/';
          return;
        }

        // Fetch orders
        const ordersResponse = await fetch('/api/getOrders');
        const ordersData = await ordersResponse.json();

        if (!ordersResponse.ok) {
          throw new Error(ordersData.error || 'Failed to fetch orders');
        }

        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to fetch orders. Please try again later.');
      }
    }

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Manager Dashboard</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Email</th>
              <th>Ordered Products</th>
              <th>Total</th>
              <th>Order Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.email}</td>
                <td>
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.pname} - {item.price}
                    </div>
                  ))}
                </td>
                <td>{order.total}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
}
