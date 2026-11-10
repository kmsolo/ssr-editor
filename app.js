const express = require("express");
const path = require("path");
const { run, all, get } = require("./db/database");

const app = express();
const port = process.env.PORT || 1337;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Lista alla dokument
app.get("/", async (req, res, next) => {
    try {
        const docs = await all(
            "SELECT id, title, updated_at FROM documents ORDER BY updated_at DESC"
        );
        res.render("index", { docs });
    } catch (err) {
        next(err);
    }
});

// Formulär för nytt dokument
app.get("/new", (req, res) => {
    res.render("new", { error: null, doc: { title: "", content: "" } });
});

// Spara nytt dokument
app.post("/new", async (req, res, next) => {
    try {
        const title = (req.body.title || "").trim();
        const content = req.body.content || "";

        if (!title) {
            return res.status(400).render("new", {
                error: "Titel måste fyllas i.",
                doc: { title, content }
            });
        }

        await run("INSERT INTO documents (title, content) VALUES (?, ?)", [title, content]);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
});

// Redigera dokument
app.get("/:id(\\d+)", async (req, res, next) => {
    try {
        const doc = await get("SELECT * FROM documents WHERE id = ?", [req.params.id]);

        if (!doc) {
            return res.status(404).render("error", { message: "Dokumentet finns inte." });
        }
        res.render("edit", { doc, error: null });
    } catch (err) {
        next(err);
    }
});

// Uppdatera dokument
app.post("/:id(\\d+)", async (req, res, next) => {
    try {
        const title = (req.body.title || "").trim();
        const content = req.body.content || "";
        const id = req.params.id;

        if (!title) {
            return res.status(400).render("edit", {
                error: "Titel måste fyllas i.",
                doc: { id, title, content }
            });
        }

        const result = await run(
            "UPDATE documents SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [title, content, id]
        );

        if (result.changes === 0) {
            return res.status(404).render("error", { message: "Dokumentet finns inte." });
        }
        res.redirect(`/${id}`);
    } catch (err) {
        next(err);
    }
});

// Ta bort dokument
app.post("/:id(\\d+)/delete", async (req, res, next) => {
    try {
        await run("DELETE FROM documents WHERE id = ?", [req.params.id]);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
});

// 404
app.use((req, res) => {
    res.status(404).render("error", { message: "Sidan finns inte." });
});

// Felhanterare
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("error", { message: "Något gick fel på servern." });
});

if (require.main === module) {
    app.listen(port, () => console.log(`ssr-editor lyssnar på http://localhost:${port}`));
}

module.exports = app;
