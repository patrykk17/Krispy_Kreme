import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function getCustomSession() {
  console.log('Loading session...');

  const password = process.env.SESSION_SECRET || 'VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf'; // Replace with a strong password

  // Await cookies() to get the cookies properly
  const cookieStore = await cookies();

  const session = await getIronSession(cookieStore, {
    password,
    cookieName: 'app',
  });

  return session;
}
