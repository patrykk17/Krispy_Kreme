import { connectToDatabase } from '../../../utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Extract email and password

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('login'); // Using the same collection for simplicity

    // Check if the username (email) already exists
    const existingUser = await collection.findOne({ username: email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists.' });
    }

    // Insert the new user with username set to email and default acctype as 'Customer'
    const result = await collection.insertOne({
      username: email, // Save email as username
      pass: password,
      acc_type: 'customer', // Default account type
    });
    console.log('User created:', result);

    return NextResponse.json({ success: true, message: 'Registration successful.' });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
