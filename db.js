// db.js
// Base de datos SQLite

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./bot_database.sqlite', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            balance INTEGER DEFAULT 100
        )
    `);
});

module.exports = db;