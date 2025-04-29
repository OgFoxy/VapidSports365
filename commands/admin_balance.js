// commands/admin_balance.js
// Comando administrativo para modificar saldo

const db = require('../db');

module.exports = {
    name: 'admin_balance',
    description: 'Modifica el saldo de un usuario (solo admins).',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('No tienes permiso para usar este comando.');
        }

        const userId = args[0];
        const nuevoSaldo = parseInt(args[1], 10);

        if (!userId || isNaN(nuevoSaldo)) {
            return message.reply('Por favor proporciona un ID de usuario y un saldo válido.');
        }

        db.run('UPDATE users SET balance = ? WHERE id = ?', [nuevoSaldo, userId], (err) => {
            if (err) {
                console.error(err.message);
                return message.reply('Hubo un error al actualizar el saldo del usuario.');
            }
            message.reply(`El saldo del usuario con ID ${userId} ha sido actualizado a ${nuevoSaldo} monedas.`);
        });
    },
};