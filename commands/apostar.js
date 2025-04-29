// commands/apostar.js
// Comando para realizar una apuesta

const db = require('../db');

module.exports = {
    name: 'apostar',
    description: 'Realiza una apuesta con tu saldo.',
    async execute(message, args) {
        const userId = message.author.id;
        const apuesta = parseInt(args[0], 10);

        if (!apuesta || isNaN(apuesta) || apuesta <= 0) {
            return message.reply('Por favor ingresa una cantidad válida para apostar.');
        }

        db.get('SELECT balance FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                console.error(err.message);
                return message.reply('Hubo un error al procesar tu apuesta.');
            }

            if (row && row.balance >= apuesta) {
                const nuevoSaldo = row.balance - apuesta;
                db.run('UPDATE users SET balance = ? WHERE id = ?', [nuevoSaldo, userId], (err) => {
                    if (err) {
                        console.error(err.message);
                        return message.reply('Hubo un error al actualizar tu saldo.');
                    }
                    message.reply(`Has apostado ${apuesta} monedas. Tu nuevo saldo es ${nuevoSaldo} monedas.`);
                });
            } else {
                message.reply('No tienes saldo suficiente para realizar esta apuesta.');
            }
        });
    },
};