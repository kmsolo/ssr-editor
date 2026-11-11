import express from "express";
import cors from "cors";
import { pathToFileURL } from "node:url";
import { getDocuments, ObjectId } from "./db/database.mjs";

const app = express();
const port = process.env.PORT || 1337;

app.use(cors());
app.use(express.json());

const toDoc = (d) => ({
    id: d._id.toString(),
    title: d.title,
    content: d.content,
    updatedAt: d.updatedAt
});

function validId(req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Ogiltigt id" });
    }
    next();
}

// Lista
app.get("/documents", async (req, res, next) => {
    try {
        const docs = await (await getDocuments()).find().sort({ updatedAt: -1 }).toArray();
        res.json(docs.map(toDoc));
    } catch (err) { next(err); }
});

// Hämta ett
app.get("/documents/:id", validId, async (req, res, next) => {
    try {
        const doc = await (await getDocuments()).findOne({ _id: new ObjectId(req.params.id) });
        if (!doc) return res.status(404).json({ error: "Dokumentet finns inte" });
        res.json(toDoc(doc));
    } catch (err) { next(err); }
});

// Skapa
app.post("/documents", async (req, res, next) => {
    try {
        const title = (req.body.title || "").trim();
        const content = req.body.content || "";
        if (!title) return res.status(400).json({ error: "Titel måste fyllas i" });

        const doc = { title, content, updatedAt: new Date().toISOString() };
        const result = await (await getDocuments()).insertOne(doc);
        res.status(201).json(toDoc({ ...doc, _id: result.insertedId }));
    } catch (err) { next(err); }
});

// Uppdatera
app.put("/documents/:id", validId, async (req, res, next) => {
    try {
        const title = (req.body.title || "").trim();
        const content = req.body.content || "";
        if (!title) return res.status(400).json({ error: "Titel måste fyllas i" });

        const result = await (await getDocuments()).updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { title, content, updatedAt: new Date().toISOString() } }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: "Dokumentet finns inte" });
        res.json({ id: req.params.id, title, content });
    } catch (err) { next(err); }
});

// Ta bort
app.delete("/documents/:id", validId, async (req, res, next) => {
    try {
        const result = await (await getDocuments()).deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: "Dokumentet finns inte" });
        res.status(204).end();
    } catch (err) { next(err); }
});

app.use((req, res) => res.status(404).json({ error: "Sidan finns inte" }));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Något gick fel på servern" });
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    app.listen(port, () => console.log(`API lyssnar på port ${port}`));
}

export default app;