import { Client, GatewayIntentBits, REST, Routes } from 'discord.js'; 
import dotenv from 'dotenv';
import { skinSearchCommand } from './commands/skinSearch.mjs';
import { randomSkinCommand } from './commands/randomSkin.mjs'; // Import the randomSkinCommand

dotenv.config();

// Initialize the client
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
  ]
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    const guild = client.guilds.cache.first(); // Get the first guild the bot is in
    const guildId = guild.id;

    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId), // Use the dynamically fetched guildId
      { body: [skinSearchCommand.data.toJSON(), randomSkinCommand.data.toJSON()] },  // Register the commands
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    console.log('Received ping command');
    message.channel.sendTyping();
    message.reply('Pong!');
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'skinsearch') {
    await skinSearchCommand.execute(interaction);  
  }

  if (interaction.commandName === 'randomskin') {
    await randomSkinCommand.execute(interaction);  
  }
});

client.login(process.env.DISCORD_TOKEN);
