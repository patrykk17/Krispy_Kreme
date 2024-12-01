import { connectToDatabase } from '../../../utils/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    console.log('Fetching jobs from MongoDB...');
    const { db } = await connectToDatabase(); 
    const collection = db.collection('products');
    const products = await collection.find({}).toArray();

    console.log('Fetched product listings:', products);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
