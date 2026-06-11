import mongoose from 'mongoose';

let memoryServer = null;

/**
 * Tests NEVER use MONGO_URL / Atlas — always an isolated in-memory replica set
 * (required for ledger transaction tests). Override with MONGODB_TEST_URI only
 * in CI if you provision a dedicated test cluster.
 */
export async function connectTestDb() {
  if (process.env.MONGODB_TEST_URI) {
    await mongoose.connect(process.env.MONGODB_TEST_URI, { serverSelectionTimeoutMS: 10_000 });
    return;
  }
  const { MongoMemoryReplSet } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(memoryServer.getUri('shelfmerch_test'));
}

export async function clearTestDb() {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
}

export async function disconnectTestDb() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
