const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Muestra tu saldo actual'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const balance = db.getBalance(userId);
    await interaction.reply({
      content: `💰 Tu balance actual es: **${balance} monedas**`,
      ephemeral: true
    });
  }
};
