import { connectToDatabase } from '../../../utils/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    // Fetch all orders
    const orders = await ordersCollection.find({}).toArray();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders.' },
      { status: 500 }
    );
  }
}
