require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Bot configuration
const config = {
  token: process.env.DISCORD_TOKEN,
  prefix: process.env.BOT_PREFIX || '!',
  logLevel: process.env.LOG_LEVEL || 'info',
  maxRepliesPerMinute: parseInt(process.env.MAX_REPLIES_PER_MINUTE) || 30
};

// Platform toggle configuration
function loadPlatformSettings() {
  const platformSettings = {
    'x.com': process.env.ENABLE_X_COM !== 'false',
    'instagram.com': process.env.ENABLE_INSTAGRAM_COM !== 'false',
    'tiktok.com': process.env.ENABLE_TIKTOK_COM !== 'false',
    'threads.net': process.env.ENABLE_THREADS_NET !== 'false',
    'youtube.com': process.env.ENABLE_YOUTUBE_COM !== 'false',
    'facebook.com': process.env.ENABLE_FACEBOOK_COM !== 'false',
    'reddit.com': process.env.ENABLE_REDDIT_COM !== 'false',
    'linkedin.com': process.env.ENABLE_LINKEDIN_COM !== 'false',
    'pinterest.com': process.env.ENABLE_PINTEREST_COM !== 'false',
    'snapchat.com': process.env.ENABLE_SNAPCHAT_COM !== 'false'
  };

  return platformSettings;
}

// Site mappings configuration
function loadSiteMappings() {
  const mappings = new Map();
  const platformSettings = loadPlatformSettings();

  // Default mappings
  const defaultMappings = {
    'x.com': 'xcancel.com',
    'www.x.com': 'xcancel.com',
    'instagram.com': 'imginn.com',
    'www.instagram.com': 'imginn.com',
    'tiktok.com': 'snaptik.app',
    'www.tiktok.com': 'snaptik.app',
    'threads.net': 'photomate.online',
    'www.threads.net': 'photomate.online',
    'youtube.com': 'ytb.trom.tf',
    'www.youtube.com': 'ytb.trom.tf',
    'facebook.com': 'mbasic.facebook.com',
    'www.facebook.com': 'mbasic.facebook.com',
    'reddit.com': 'teddit.net',
    'www.reddit.com': 'teddit.net',
    'linkedin.com': 'libredd.it',
    'www.linkedin.com': 'libredd.it',
    'pinterest.com': 'pin.it',
    'www.pinterest.com': 'pin.it',
    'snapchat.com': 'snapinsta.app',
    'www.snapchat.com': 'snapinsta.app'
  };

  // Load default mappings only for enabled platforms
  Object.entries(defaultMappings).forEach(([source, target]) => {
    const baseDomain = source.replace(/^www\./, '');
    if (platformSettings[baseDomain]) {
      mappings.set(source, target);
    }
  });

  // Load custom mappings from environment variables for enabled platforms
  Object.keys(process.env).forEach(key => {
    if (key.endsWith('_COM') || key.endsWith('_NET') || key.endsWith('_ORG')) {
      const domain = key.toLowerCase().replace(/_/g, '.');
      const baseDomain = domain.replace(/^www\./, '');
      const target = process.env[key];

      if (target && target.trim() && platformSettings[baseDomain] !== false) {
        mappings.set(domain, target.trim());
        // Also add www. variant if not already present
        const wwwDomain = `www.${domain}`;
        if (!mappings.has(wwwDomain)) {
          mappings.set(wwwDomain, target.trim());
        }
      }
    }
  });

  return mappings;
}

const siteMappings = loadSiteMappings();

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

// Dynamic regex pattern for all supported domains
function createUrlRegex(domains) {
  const domainPatterns = Array.from(domains.keys())
    .map(domain => domain.replace(/\./g, '\\.'))
    .join('|');
  return new RegExp(`\\bhttps?:\/\/(?:www\\.)?(${domainPatterns})\/([^\\s]+)`, 'gi');
}

const URL_REGEX = createUrlRegex(siteMappings);

// Logger utility
const logger = {
  info: (msg) => config.logLevel !== 'error' && console.log(`[INFO] ${msg}`),
  warn: (msg) => config.logLevel !== 'error' && console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`)
};

// Convert URL using site mappings
function convertUrl(url) {
  try {
    const urlObj = new URL(url);
    const targetDomain = siteMappings.get(urlObj.hostname);

    if (targetDomain) {
      urlObj.hostname = targetDomain;
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

// Extract supported links from message
function extractSupportedLinks(content) {
  const links = [];
  let match;

  // Reset regex lastIndex
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(content)) !== null) {
    const originalUrl = match[0];
    const convertedUrl = convertUrl(originalUrl);

    if (convertedUrl) {
      links.push({
        original: originalUrl,
        converted: convertedUrl
      });
    }
  }

  return links;
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

    // Extract supported links
    const supportedLinks = extractSupportedLinks(message.content);

    if (supportedLinks.length > 0) {
      logger.info(`Found ${supportedLinks.length} supported links in message from ${message.author.tag}`);

      // Create reply message
      let replyContent = '🔗 **Alternative links:**\n';

      supportedLinks.forEach((link, index) => {
        replyContent += `${index + 1}. ${link.converted}\n`;
      });

      // Send reply
      await message.reply({
        content: replyContent,
        allowedMentions: { repliedUser: false } // Don't ping the user
      });

      logger.info(`Replied to message with ${supportedLinks.length} converted links`);
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