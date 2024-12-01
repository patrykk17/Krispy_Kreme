import { connectToDatabase } from '../../../utils/db';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const cookieStore = await cookies(); // Retrieve cookies
    const session = await getIronSession(cookieStore, {
      password: process.env.SESSION_SECRET || 'VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf',
      cookieName: 'app',
    });

    if (!session?.loggedIn || !session.email) {
      return NextResponse.json(
        { error: 'Unauthorized: No session or email found.' },
        { status: 401 }
      );
    }

    const { items } = await req.json(); // Parse the request payload
    const email = session.email; // Retrieve email from session

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: Items are missing.' },
        { status: 400 }
      );
    }

    // Calculate total price
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price.split(' ')[0]); // Extract numeric price from string
      return !isNaN(price) ? sum + price : sum; // Skip invalid prices
    }, 0);

    console.log('Calculated total:', total);

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');
    const cartsCollection = db.collection('carts'); // Assuming a carts collection exists

    // Create the order object
    const order = {
      email, // Use email from session
      items,
      total: `${total.toFixed(2)} euro`, // Format total to two decimal places
      createdAt: new Date(),
    };

    // Save the order to the database
    const result = await ordersCollection.insertOne(order);

    if (result.acknowledged) {
      console.log('Order saved successfully:', result.insertedId);

      // Clear the cart after checkout
      await cartsCollection.deleteOne({ email });

      return NextResponse.json({ success: true, orderId: result.insertedId });
    } else {
      throw new Error('Failed to save the order.');
    }
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout.' },
      { status: 500 }
    );
  }
}
