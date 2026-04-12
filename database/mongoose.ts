import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Set Google DNS and force IPv4 only if on the server to avoid build-time trace hangs
const applyDnsFix = async () => {
    if (typeof window === 'undefined') {
        try {
            const dns = await import('node:dns');
            if (dns.setDefaultResultOrder) {
                dns.setDefaultResultOrder('ipv4first');
            }
            dns.setServers(['8.8.8.8']);
            console.log('MongoDB: Custom DNS settings applied');
        } catch (e) {
            console.error('Failed to set custom DNS:', e);
        }
    }
};

applyDnsFix();

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if (!MONGODB_URI) {
        throw new Error("MongoDB URI is missing");
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false, family: 4 });
    }

    try {
        cached.conn = await cached.promise;
    }
    catch (err) {
        cached.promise = null;
        throw err;
    }

    console.log(`MongoDB Connected ${MONGODB_URI} in ${process.env.NODE_ENV}`);
    return cached.conn;
}