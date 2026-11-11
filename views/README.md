## Kom igång
git clone <repo-url>
cd ssr-editor
npm install
node app.mjs
Öppna http://localhost:1337 (databasen docs.sqlite skapas automatiskt om den saknas)

## Steg vi gick igenom
1. Fick appen att starta med `node app.mjs`. Ursprungligen var den
   CommonJS (`app.js`), så vi döpte om filerna till `.mjs` och bytte
   `require` mot `import`.
2. Åtgärdade säkerhetshål med `npm audit` / `npm audit fix`.
3. Ersatte `POST /:id` med `POST /update`, där dokumentets id skickas
   med som dolt fält i formuläret.
4. Uppdaterade vyerna så att samma formulär (`partials/form.ejs`)
   används för att skapa (`/new`) och uppdatera (`/update`) dokument.

## Val av frontend-ramverk
Vi har valt **<ramverk>** eftersom ... (2–4 meningar).