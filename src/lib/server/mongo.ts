import { env } from "$env/dynamic/private";
import { MongoClient } from 'mongodb';

const url = env.MONGO_URL ?? 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

export async function startMongoDB() {
	console.log('Connecting to MongoDB on '+url);

	try {	
		await client.connect();
		console.log('Connected successfully');
	} catch (error) {
		console.error("Can't connect to database!");
	}	
}

export const db = client.db('map');
