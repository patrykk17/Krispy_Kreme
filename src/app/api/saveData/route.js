import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const session = await getIronSession(await cookies(), {
      password: process.env.SESSION_SECRET || "VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf",
      cookieName: "app",
    });

    // Ensure session exists and is valid
    if (!session?.loggedIn) {
      console.error("Session not found or user not logged in");
      return new Response(
        JSON.stringify({ error: "Unauthorized access" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log the session data for debugging
    console.log("Session data retrieved:", session);

    // Process data (e.g., cart logic) as needed
    return new Response(JSON.stringify({ success: true, message: "Session data valid" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling saveData:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
