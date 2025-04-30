const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('historial')
    .setDescription('Muestra tus últimas apuestas'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const historial = db.getHistorial(userId);

    if (historial.length === 0) {
      return interaction.reply({ content: '🎲 No tienes apuestas registradas aún.', ephemeral: true });
    }

    let mensaje = '📜 **Tus últimas apuestas:**\n\n';
    historial.forEach((apuesta, i) => {
      mensaje += `**${i + 1}.** ${apuesta.evento} - ${apuesta.cantidad} monedas - Resultado: ${apuesta.resultado}\n`;
    });

    await interaction.reply({ content: mensaje, ephemeral: true });
  }
};
