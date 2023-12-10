import { env } from '$env/dynamic/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(env.MONGO_URL ?? 'mongodb://127.0.0.1:27017');

export async function startMongoDB() {
	console.log('Connecting to MongoDB Database...');
	if (!env.MONGO_URL) throw new Error('MongoDB URL not supplied');

	await client.connect();
	console.log('Connected successfully');
}

export const db = client.db('map');
