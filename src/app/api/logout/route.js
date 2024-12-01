import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    // Retrieve the session using iron-session
    const session = await getIronSession(cookies(), {
      password: process.env.SESSION_SECRET || 'VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf',
      cookieName: 'app',
    });

    // Destroy the session
    session.destroy();

    // Send success response
    return new Response(
      JSON.stringify({ message: 'Logged out successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Handle errors
    console.error('Error during logout:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
