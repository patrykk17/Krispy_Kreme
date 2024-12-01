import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch data from Weather API
    const res = await fetch('http://api.weatherapi.com/v1/current.json?key=5eb626f567d74b92841142504242310&q=Dublin&aqi=no');
    const data = await res.json();

    // Extract the current temperature
    const currentTemp = data.current.temp_c;

    // Send the temperature data as a response
    return NextResponse.json({ temp: currentTemp });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
