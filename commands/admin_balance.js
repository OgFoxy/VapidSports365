const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin_balance')
    .setDescription('Añadir o quitar saldo de un usuario (solo administradores)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario al que modificar saldo')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de saldo a añadir o quitar (puede ser negativo)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const admin = interaction.user;
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ No tienes permisos para usar este comando.', ephemeral: true });
    }

    const usuario = interaction.options.getUser('usuario');
    const cantidad = interaction.options.getInteger('cantidad');
    const userId = usuario.id;

    db.changeBalance(userId, cantidad);
    const nuevoSaldo = db.getBalance(userId);

    await interaction.reply({
      content: `✅ El saldo de ${usuario} ha sido actualizado a **${nuevoSaldo} monedas**.`,
      ephemeral: true
    });
  }
};
