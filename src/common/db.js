import { MongoClient, ServerApiVersion } from "mongodb";

process.loadEnvFile();

export const MONGODB_URI = process.env.MONGODB_URI;

export const DB_NAME = process.env.DB_NAME;

export const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Abre la conexion con cluster y verifica que responda mediante un ping
export const conectarAtlas = async () => {
  await client.connect();
  await client.db(DB_NAME).command({ ping: 1 });
  return client;
};

// Cierra la conexion con cluster.
export const cerrarConexion = async () => {
  await client.close();
};
