import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "ssr-editor";

const client = new MongoClient(uri);
let db;

export async function getDocuments() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
    }
    return db.collection("documents");
}

export async function closeDb() {
    await client.close();
    db = undefined;
}

export { ObjectId };
