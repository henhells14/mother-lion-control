import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Määritä MONGODB_URI ympäristömuuttuja .env.local tiedostoon');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // Kehitysympäristössä käytetään globaalia muuttujaa, jotta yhteys ei katkea 
    // joka kerta kun tallennat koodia (HMR).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // Tuotantoympäristössä (Vercel) luodaan uusi yhteys.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;