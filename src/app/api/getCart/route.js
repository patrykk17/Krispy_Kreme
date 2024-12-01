import { connectToDatabase } from '../../../utils/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const email = req.headers.get('email'); // Assuming email is sent in the request header

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log(`Fetching cart items for email: ${email}`);

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection('carts'); // Assuming cart items are stored in the 'carts' collection

    // Fetch the user's cart
    const cart = await collection.findOne({ email });

    if (!cart) {
      return NextResponse.json({ cartItems: [] }, { status: 200 }); // Return empty cart if not found
    }

    console.log('Fetched cart:', cart);
    return NextResponse.json({ cartItems: cart.items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
