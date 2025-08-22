require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Bot configuration
const config = {
  token: process.env.DISCORD_TOKEN,
  prefix: process.env.BOT_PREFIX || '!',
  logLevel: process.env.LOG_LEVEL || 'info',
  maxRepliesPerMinute: parseInt(process.env.MAX_REPLIES_PER_MINUTE) || 30
};

// Rate limiting
const replyHistory = new Map();
const REPLY_WINDOW_MS = 60 * 1000; // 1 minute

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Regex pattern for x.com links (case insensitive)
const X_COM_REGEX = /\bhttps?:\/\/(?:www\.)?x\.com\/([^\s]+)/gi;

// Logger utility
const logger = {
  info: (msg) => config.logLevel !== 'error' && console.log(`[INFO] ${msg}`),
  warn: (msg) => config.logLevel !== 'error' && console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`)
};

// Convert x.com URL to xcancel.com
function convertToXCancel(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'x.com' || urlObj.hostname === 'www.x.com') {
      urlObj.hostname = 'xcancel.com';
      urlObj.protocol = 'https:'; // Ensure HTTPS
      return urlObj.toString();
    }
    return null;
  } catch (error) {
    logger.error(`Error converting URL ${url}: ${error.message}`);
    return null;
  }
}

// Check rate limit for user
function checkRateLimit(userId) {
  const now = Date.now();
  const userHistory = replyHistory.get(userId) || [];

  // Remove old entries
  const recentReplies = userHistory.filter(timestamp =>
    now - timestamp < REPLY_WINDOW_MS
  );

  // Check if under limit
  if (recentReplies.length >= config.maxRepliesPerMinute) {
    logger.warn(`Rate limit exceeded for user ${userId}`);
    return false;
  }

  // Add current timestamp
  recentReplies.push(now);
  replyHistory.set(userId, recentReplies);
  return true;
}

// Extract x.com links from message
function extractXComLinks(content) {
  const links = [];
  let match;

  // Reset regex lastIndex
  X_COM_REGEX.lastIndex = 0;

  while ((match = X_COM_REGEX.exec(content)) !== null) {
    links.push({
      original: match[0],
      converted: convertToXCancel(match[0])
    });
  }

  return links.filter(link => link.converted !== null);
}

// Event: Bot ready
client.once('ready', () => {
  logger.info(`Bot is ready! Logged in as ${client.user.tag}`);
  logger.info(`Bot is monitoring ${client.guilds.cache.size} servers`);
});

// Event: Message received
client.on('messageCreate', async (message) => {
  try {
    // Ignore bot messages and messages without content
    if (message.author.bot || !message.content) return;

    // Check rate limit
    if (!checkRateLimit(message.author.id)) {
      return; // Silently ignore if rate limited
    }

    // Extract x.com links
    const xLinks = extractXComLinks(message.content);

    if (xLinks.length > 0) {
      logger.info(`Found ${xLinks.length} x.com links in message from ${message.author.tag}`);

      // Create reply message
      let replyContent = '🔗 **Alternative links:**\n';

      xLinks.forEach((link, index) => {
        replyContent += `${index + 1}. ${link.converted}\n`;
      });

      // Send reply
      await message.reply({
        content: replyContent,
        allowedMentions: { repliedUser: false } // Don't ping the user
      });

      logger.info(`Replied to message with ${xLinks.length} converted links`);
    }

  } catch (error) {
    logger.error(`Error processing message: ${error.message}`);
  }
});

// Event: Error handling
client.on('error', (error) => {
  logger.error(`Discord client error: ${error.message}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Validate configuration
if (!config.token) {
  logger.error('DISCORD_TOKEN is required in environment variables');
  process.exit(1);
}

// Login to Discord
client.login(config.token).catch((error) => {
  logger.error(`Failed to login: ${error.message}`);
  process.exit(1);
});