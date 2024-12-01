import { MongoClient } from 'mongodb';

const url = 'mongodb+srv://root:root@cluster0.kla29.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
const dbName = 'app';

let cachedClient = null;
let cachedDb = null;

// Function to connect to the database
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log('Using cached MongoDB connection');
    return { client: cachedClient, db: cachedDb };
  }

  console.log('Connecting to MongoDB...');
  await client.connect();
  cachedClient = client;
  cachedDb = client.db(dbName);
  console.log('Connected successfully to MongoDB');
  return { client: cachedClient, db: cachedDb };
}
