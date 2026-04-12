import "server-only";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is missing");
}

declare global {
    var _mongoClient: MongoClient | undefined;
}

const client = global._mongoClient ?? new MongoClient(uri);

if (!global._mongoClient) {
    global._mongoClient = client;
}

export function getDatabase() {
    return client.db(process.env.MONGODB_DB || undefined);
}

export default client;
