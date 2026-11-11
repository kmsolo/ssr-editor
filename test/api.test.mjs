import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.mjs";
import { getDocuments, closeDb } from "../db/database.mjs";

after(async () => {
    await (await getDocuments()).deleteMany({});
    await closeDb();
});

test("skapa, hämta, uppdatera och ta bort ett dokument", async () => {
    const created = await request(app).post("/documents").send({ title: "Hej", content: "text" });
    assert.equal(created.status, 201);
    const id = created.body.id;

    const fetched = await request(app).get(`/documents/${id}`);
    assert.equal(fetched.body.title, "Hej");

    const updated = await request(app).put(`/documents/${id}`).send({ title: "Ny", content: "x" });
    assert.equal(updated.status, 200);

    const list = await request(app).get("/documents");
    assert.equal(list.body.length, 1);

    const deleted = await request(app).delete(`/documents/${id}`);
    assert.equal(deleted.status, 204);
});

test("titel krävs", async () => {
    const res = await request(app).post("/documents").send({ title: "", content: "x" });
    assert.equal(res.status, 400);
});

test("ogiltigt id ger 400", async () => {
    const res = await request(app).get("/documents/abc");
    assert.equal(res.status, 400);
});
