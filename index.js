// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// ======= Express web server (for Render free tier) =======
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));

// ======= Discord Bot Setup =======
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// List of banned words
const badWords = [
  "fuck", "shit", "bitch", "nigga", "nigger",
  "pussy", "dick", "ass", "ahh", "penis",
  "porn", "fck", "fuk", "fcuk", "goon", "nig"
];

// Normalize messages to catch leetspeak and symbols
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[@]/g, "a")
    .replace(/[0]/g, "o")
    .replace(/[1]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[^a-z]/g, ""); // remove symbols/spaces
}

// Bot ready event
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Message filter
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const cleanMessage = normalize(message.content);

  for (const word of badWords) {
    if (cleanMessage.includes(word)) {
      // Delete the message
      await message.delete().catch(() => {});

      // Warn the user
      await message.channel.send(
        `${message.author}, that word is not allowed.`
      );

      break;
    }
  }
});

// Login using environment variable
client.login(process.env.TOKEN);
