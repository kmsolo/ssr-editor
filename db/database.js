const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const file = process.env.DB_FILE || path.join(__dirname, "docs.sqlite");
const db = new sqlite3.Database(file);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Små promise-wrappers så att routes kan använda async/await
const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            err ? reject(err) : resolve({ id: this.lastID, changes: this.changes });
        });
    });

const all = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
    });

const get = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
    });

module.exports = { db, run, all, get };
