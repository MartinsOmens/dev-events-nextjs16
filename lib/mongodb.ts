import mongoose from "mongoose";

// MongoDB connection string
// Ensure you have MONGODB_URI defined in your environment variables (e.g. .env.local)
const MONGODB_URI = process.env.MONGODB_URI;

// Describe the shape of our cached connection object
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the Node.js global type to include our cache property
// This avoids "Cannot redeclare block-scoped variable" errors in Next.js
// during hot-reloads in development.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Use the existing global cache if it exists, otherwise initialize it.
// In production, global is not reloaded between requests, so this is safe.
const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Establishes (or reuses) a cached Mongoose connection.
 *
 * This function is safe to call in API routes, server components,
 * and server actions. It prevents creating multiple connections
 * during development when Next.js performs hot reloads.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside your environment (e.g. .env.local)"
    );
  }
  // If we already have an active connection, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is already in-flight, await it instead of creating a new one.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        // Add any options you need here; leaving it empty uses Mongoose defaults.
        // Example:
        // dbName: 'your-database-name',
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
