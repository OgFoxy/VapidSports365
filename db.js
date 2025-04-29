const Database = require('better-sqlite3');
const db = new Database('apuestas.db');

// Crear tablas si no existen
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 1000
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS apuestas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    evento TEXT,
    cantidad INTEGER,
    resultado TEXT DEFAULT 'pendiente'
  )
`).run();

module.exports = {
  getUser(userId) {
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) {
      db.prepare('INSERT INTO users (user_id) VALUES (?)').run(userId);
      return { user_id: userId, balance: 1000 };
    }
    return user;
  },

  changeBalance(userId, amount) {
    this.getUser(userId); // Asegura que existe
    db.prepare('UPDATE users SET balance = balance + ? WHERE user_id = ?').run(amount, userId);
  },

  getBalance(userId) {
    return this.getUser(userId).balance;
  },

  createBet(userId, evento, cantidad) {
    this.changeBalance(userId, -cantidad);
    db.prepare(`
      INSERT INTO apuestas (user_id, evento, cantidad) VALUES (?, ?, ?)
    `).run(userId, evento, cantidad);
  },

  getHistorial(userId, limit = 5) {
    return db.prepare(`
      SELECT evento, cantidad, resultado FROM apuestas
      WHERE user_id = ? ORDER BY id DESC LIMIT ?
    `).all(userId, limit);
  }
};
