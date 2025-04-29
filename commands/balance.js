// commands/balance.js
// Comando para ver el saldo del usuario

const db = require('../db');

module.exports = {
    name: 'balance',
    description: 'Muestra tu saldo actual.',
    async execute(message) {
        const userId = message.author.id;
        db.get('SELECT balance FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                console.error(err.message);
                return message.reply('Hubo un error al obtener tu saldo.');
            }

            if (row) {
                message.reply(`Tu saldo actual es ${row.balance} monedas.`);
            } else {
                db.run('INSERT INTO users (id, username) VALUES (?, ?)', [userId, message.author.username], (err) => {
                    if (err) {
                        console.error(err.message);
                        return message.reply('Hubo un error al registrarte.');
                    }
                    message.reply('Tu saldo actual es 100 monedas.');
                });
            }
        });
    },
};