const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Colección de comandos
client.commands = new Collection();

// Cargar comandos desde /commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[ADVERTENCIA] El comando en ${filePath} está incompleto.`);
  }
}

// Evento: Bot listo
client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

  try {
    await client.application.commands.set(client.commands.map(cmd => cmd.data));
    console.log("📡 Comandos slash registrados globalmente.");
  } catch (error) {
    console.error("Error registrando comandos:", error);
  }
});

// Evento: Interacción de comandos
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '⚠️ Hubo un error ejecutando este comando.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
