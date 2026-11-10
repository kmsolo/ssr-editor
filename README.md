# ssr-editor

Serverrenderad dokumenteditor med Express, EJS och SQLite.

## Kom igång

    npm install
    npm start

Öppna http://localhost:1337

## Struktur

    app.js               Express-app och routes
    db/database.js       SQLite-anslutning, tabell och hjälpfunktioner
    views/               EJS-mallar (partials/ för delad header, footer, formulär)
    public/style.css     Stilmall

## Routes

| Metod | Sökväg        | Beskrivning          |
|-------|---------------|----------------------|
| GET   | /             | Lista dokument       |
| GET   | /new          | Formulär nytt        |
| POST  | /new          | Skapa dokument       |
| GET   | /:id          | Redigera dokument    |
| POST  | /:id          | Uppdatera dokument   |
| POST  | /:id/delete   | Ta bort dokument     |
