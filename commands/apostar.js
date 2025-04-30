const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apostar')
    .setDescription('Haz una apuesta en un evento')
    .addStringOption(option =>
      option.setName('evento')
        .setDescription('Nombre del evento (ej. Real Madrid vs Barça)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad a apostar')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const evento = interaction.options.getString('evento');
    const cantidad = interaction.options.getInteger('cantidad');
    const balance = db.getBalance(userId);

    if (cantidad <= 0) {
      return interaction.reply({ content: '❌ La cantidad debe ser mayor que cero.', ephemeral: true });
    }

    if (cantidad > balance) {
      return interaction.reply({ content: '❌ No tienes suficiente saldo.', ephemeral: true });
    }

    db.createBet(userId, evento, cantidad);
    await interaction.reply({
      content: `✅ Apuesta registrada: **${cantidad} monedas** en **${evento}**.`,
      ephemeral: true
    });
  }
};
