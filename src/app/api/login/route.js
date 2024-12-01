import { getIronSession } from 'iron-session';
import { connectToDatabase } from '../../../utils/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Get email and password

    console.log('Login attempt:', email);

    // Database connection
    const { db } = await connectToDatabase();
    const collection = db.collection('login');

    const user = await collection.findOne({ username: email, pass: password });

    if (user) {
      // Await cookies() to retrieve the cookie store
      const cookieStore = await cookies();

      // Create the session using iron-session
      const session = await getIronSession(cookieStore, {
        password: process.env.SESSION_SECRET || 'VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf',
        cookieName: 'app',
      });

      // Ensure `email` and `acc_type` are properly assigned
      session.email = user.username; // Assuming `username` is the email
      session.loggedIn = true;
      session.acc_type = user.acctype || 'customer'; // Default to 'customer' if `acctype` is missing
      await session.save(); // Save the session

      console.log('Session data saved:', session);

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        acctype: user.acctype,
      });
    } else {
      console.error('Invalid login credentials');
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
