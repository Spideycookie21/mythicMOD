const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const badWords = ["fuck", "shit", "bitch","nigga","nigger","pussy","dick","ass","ahh","penis","porn","fck","fuk","fcuk","goon","nig","]; // add whatever words

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[@]/g, "a")
    .replace(/[0]/g, "o")
    .replace(/[1]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[^a-z]/g, ""); // remove symbols/spaces
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const cleanMessage = normalize(message.content);

  for (const word of badWords) {
    if (cleanMessage.includes(word)) {

      await message.delete().catch(() => {});

      await message.channel.send(
        `${message.author}, that word is not allowed.`
      );

      break;
    }
  }
});

client.login(process.env.TOKEN);
