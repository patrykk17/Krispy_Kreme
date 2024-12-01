import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    const cookieStore = await cookies(); // Fetch cookies
    const session = await getIronSession(cookieStore, {
      password: process.env.SESSION_SECRET || 'VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf',
      cookieName: 'app',
    });

    if (session?.loggedIn) {
      return new Response(
        JSON.stringify({
          loggedIn: true,
          email: session.email,
          acc_type: session.acc_type,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ loggedIn: false }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching session:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
