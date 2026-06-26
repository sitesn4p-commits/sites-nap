import { MongoClient, ObjectId } from "mongodb";
import dns from "dns";

const uri = process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "buildpro";
const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
const allowInvalidCertificates = process.env.MONGODB_TLS_ALLOW_INVALID_CERTIFICATES === "true";

if (dnsServers?.length) {
  dns.setServers(dnsServers);
}

type MongoCache = {
  client?: MongoClient;
  promise?: Promise<MongoClient>;
};

declare global {
  // eslint-disable-next-line no-var
  var __buildproMongo: MongoCache | undefined;
}

const cache = globalThis.__buildproMongo || (globalThis.__buildproMongo = {});

export const collections = {
  products: "products",
  sliders: "sliders",
  orders: "orders",
  reviews: "reviews"
} as const;

let indexesReady = false;

export async function getMongoClient() {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cache.client) {
    return cache.client;
  }

  if (!cache.promise) {
    cache.promise = new MongoClient(uri, {
      tlsAllowInvalidCertificates: allowInvalidCertificates
    }).connect();
  }

  cache.client = await cache.promise;
  return cache.client;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(dbName);
}

export function objectIdFrom(value: string) {
  if (!ObjectId.isValid(value)) {
    return null;
  }

  return new ObjectId(value);
}

export async function ensureIndexes() {
  if (indexesReady) {
    return;
  }

  const db = await getDb();
  await Promise.all([
    db.collection(collections.products).createIndex({ slug: 1 }, { unique: true }),
    db.collection(collections.products).createIndex({ category: 1, active: 1 }),
    db.collection(collections.products).createIndex({ featured: 1, active: 1 }),
    db.collection(collections.sliders).createIndex({ sortOrder: 1, active: 1 }),
    db.collection(collections.orders).createIndex({ createdAt: -1 }),
    db.collection(collections.orders).createIndex({ status: 1 }),
    db.collection(collections.reviews).createIndex({ productId: 1, approved: 1 })
  ]);

  indexesReady = true;
}
