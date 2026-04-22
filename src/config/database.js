const mongoose = require("mongoose");
const dns = require("node:dns");

let hasConnected = false;

function configureDnsServers() {
  const rawValue = process.env.MONGODB_DNS_SERVERS;

  if (!rawValue) {
    return;
  }

  const servers = rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (servers.length > 0) {
    dns.setServers(servers);
  }
}

function createHelpfulConnectionError(lastError) {
  if (
    lastError &&
    (lastError.code === "ECONNREFUSED" || lastError.code === "ENOTFOUND") &&
    typeof lastError.hostname === "string" &&
    lastError.hostname.startsWith("_mongodb._tcp.")
  ) {
    return new Error(
      `MongoDB SRV lookup failed for ${lastError.hostname}. Check MONGODB_URI in .env, try MONGODB_DNS_SERVERS, or use a standard Atlas mongodb:// connection string.`
    );
  }

  return lastError;
}

async function connectDatabase() {
  if (hasConnected) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    configureDnsServers();

    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB,
    });
  } catch (error) {
    throw createHelpfulConnectionError(error);
  }

  hasConnected = true;
  console.log("Connected to MongoDB");

  return mongoose.connection;
}

module.exports = connectDatabase;
