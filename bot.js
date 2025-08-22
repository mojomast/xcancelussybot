require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Bot configuration
const config = {
  token: process.env.DISCORD_TOKEN,
  name: process.env.BOT_NAME || 'SlopBot™',
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

// Image Macro System (v0.2)
const fs = require('fs').promises;
const path = require('path');

const MACRO_FILE = path.join(__dirname, 'data', 'image_macros.json');
const REQUESTS_FILE = path.join(__dirname, 'data', 'requests.json');
const RPG_PLAYERS_FILE = path.join(__dirname, 'data', 'rpg', 'players.json');
const RPG_CHANNELS_FILE = path.join(__dirname, 'data', 'rpg', 'channels.json');

// Load image macros from file
async function loadImageMacros() {
  try {
    const data = await fs.readFile(MACRO_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading image macros:', error);
    return { macros: {}, settings: { maxMacrosPerUser: 5, cooldownSeconds: 30, allowedDomains: ['imgur.com', 'i.imgur.com'] } };
  }
}

// Save image macros to file
async function saveImageMacros(data) {
  try {
    await fs.writeFile(MACRO_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving image macros:', error);
    return false;
  }
}

// Validate imgur URL
function isValidImgurUrl(url) {
  try {
    const urlObj = new URL(url);
    const allowedDomains = ['imgur.com', 'i.imgur.com', 'www.imgur.com'];
    return allowedDomains.includes(urlObj.hostname);
  } catch (error) {
    return false;
  }
}

// Rate limiting for macros
const macroCooldowns = new Map();

// Load RPG data from files
async function loadRPGData(type) {
  const files = {
    players: RPG_PLAYERS_FILE,
    channels: RPG_CHANNELS_FILE
  };

  try {
    const data = await fs.readFile(files[type], 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading RPG ${type}:`, error);
    return type === 'players' ?
      { players: {}, settings: { startingStats: { health: 100, attack: 10, defense: 5, gold: 50, level: 1, experience: 0 }, combatCooldown: 60, maxPlayersPerChannel: 20 } } :
      { activeChannels: {}, settings: { maxActiveChannels: 5, channelTimeoutHours: 24 } };
  }
}

// Load and save request data
async function loadRequestData() {
  try {
    const data = await fs.readFile(REQUESTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading requests:', error);
    return {
      requests: {},
      settings: { maxRequestsPerUser: 3, requestCooldownHours: 24, maxRequestLength: 500 },
      stats: { totalRequests: 0, approvedRequests: 0, rejectedRequests: 0, pendingRequests: 0 }
    };
  }
}

async function saveRequestData(data) {
  try {
    await fs.writeFile(REQUESTS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving requests:', error);
    return false;
  }
}

// Save RPG data to files
async function saveRPGData(type, data) {
  const files = {
    players: RPG_PLAYERS_FILE,
    channels: RPG_CHANNELS_FILE
  };

  try {
    await fs.writeFile(files[type], JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving RPG ${type}:`, error);
    return false;
  }
}

// RPG rate limiting
const rpgCooldowns = new Map();

// Request rate limiting
const requestCooldowns = new Map();

// Image macro command handlers
async function handleImageMacro(message) {
  if (!message.content.startsWith('!!')) return;

  const keyword = message.content.slice(2).trim().toLowerCase();
  if (!keyword) return;

  try {
    const data = await loadImageMacros();
    const macro = data.macros[keyword];

    if (!macro) return; // Macro doesn't exist

    // Check cooldown
    const userId = message.author.id;
    const cooldownKey = `${userId}_${keyword}`;
    const now = Date.now();
    const cooldownTime = data.settings.cooldownSeconds * 1000;

    if (macroCooldowns.has(cooldownKey)) {
      const lastUsed = macroCooldowns.get(cooldownKey);
      if (now - lastUsed < cooldownTime) {
        const remaining = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
        await message.reply(`⏰ Please wait ${remaining} seconds before using this macro again.`);
        return;
      }
    }

    // Update usage stats
    macro.usageCount = (macro.usageCount || 0) + 1;
    macro.lastUsed = new Date().toISOString();

    // Save updated data
    await saveImageMacros(data);

    // Set cooldown
    macroCooldowns.set(cooldownKey, now);

    // Send the image
    await message.reply(macro.url);

    logger.info(`Image macro "${keyword}" triggered by ${message.author.tag}`);

  } catch (error) {
    logger.error(`Error handling image macro: ${error.message}`);
  }
}

// Bot request command handlers
async function handleRequestCommands(message) {
  if (!message.content.startsWith('!request')) return;

  const args = message.content.split(' ');
  const subCommand = args[1]?.toLowerCase();
  const userId = message.author.id;

  try {
    const data = await loadRequestData();

    switch (subCommand) {
      case 'list': {
        const requests = Object.entries(data.requests);
        if (requests.length === 0) {
          await message.reply('📝 No feature requests have been submitted yet.');
          return;
        }

        let response = '📋 **Feature Requests:**\n';
        requests.forEach(([id, request]) => {
          const status = request.status === 'pending' ? '⏳' :
                        request.status === 'approved' ? '✅' : '❌';
          response += `${status} **#${id}**: ${request.description.substring(0, 50)}${request.description.length > 50 ? '...' : ''} - by ${request.author}\n`;
        });
        await message.reply(response);
        break;
      }

      case 'status': {
        const requestId = args[2];
        if (!requestId) {
          await message.reply('Usage: `!request status <id>`');
          return;
        }

        const request = data.requests[requestId];
        if (!request) {
          await message.reply(`❌ Request #${requestId} not found.`);
          return;
        }

        const statusMessage = `📊 **Request #${requestId} Status:**
• **Description**: ${request.description}
• **Status**: ${request.status.toUpperCase()}
• **Author**: ${request.author}
• **Submitted**: ${new Date(request.submittedAt).toLocaleDateString()}
${request.reviewedAt ? `• **Reviewed**: ${new Date(request.reviewedAt).toLocaleDateString()}` : ''}
${request.reviewedBy ? `• **Reviewed by**: ${request.reviewedBy}` : ''}`;

        await message.reply(statusMessage);
        break;
      }

      case 'approve': {
        if (!message.member.permissions.has('Administrator')) {
          await message.reply('❌ This command requires administrator permissions.');
          return;
        }

        const requestId = args[2];
        if (!requestId) {
          await message.reply('Usage: `!request approve <id>`');
          return;
        }

        const request = data.requests[requestId];
        if (!request) {
          await message.reply(`❌ Request #${requestId} not found.`);
          return;
        }

        if (request.status !== 'pending') {
          await message.reply(`❌ Request #${requestId} has already been ${request.status}.`);
          return;
        }

        request.status = 'approved';
        request.reviewedAt = new Date().toISOString();
        request.reviewedBy = message.author.username;
        data.stats.approvedRequests++;
        data.stats.pendingRequests--;

        await saveRequestData(data);
        await message.reply(`✅ Request #${requestId} approved! The feature "${request.description}" will be considered for implementation.`);

        // Try to notify the original requester
        try {
          const originalAuthor = await message.guild.members.fetch(request.authorId);
          if (originalAuthor) {
            await originalAuthor.send(`🎉 Your feature request "${request.description}" has been approved!`);
          }
        } catch (error) {
          console.error('Could not notify original requester:', error);
        }

        logger.info(`Admin ${message.author.tag} approved request #${requestId}`);
        break;
      }

      default: {
        // This is a new request submission
        const description = args.slice(1).join(' ');
        if (!description || description.trim().length === 0) {
          await message.reply('Usage: `!request <feature_description>`');
          return;
        }

        if (description.length > data.settings.maxRequestLength) {
          await message.reply(`❌ Request description is too long. Maximum length is ${data.settings.maxRequestLength} characters.`);
          return;
        }

        // Check user's request limit
        const userRequests = Object.values(data.requests).filter(r => r.authorId === userId).length;
        if (userRequests >= data.settings.maxRequestsPerUser) {
          await message.reply(`❌ You've reached the maximum of ${data.settings.maxRequestsPerUser} requests per user.`);
          return;
        }

        // Check cooldown
        const now = Date.now();
        const cooldownKey = `request_${userId}`;
        const cooldownTime = data.settings.requestCooldownHours * 60 * 60 * 1000;

        if (requestCooldowns.has(cooldownKey)) {
          const lastUsed = requestCooldowns.get(cooldownKey);
          if (now - lastUsed < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - lastUsed)) / (60 * 60 * 1000));
            await message.reply(`⏰ Please wait ${remaining} hours before submitting another request.`);
            return;
          }
        }

        // Generate request ID
        const requestId = (data.stats.totalRequests + 1).toString();

        data.requests[requestId] = {
          id: requestId,
          description: description.trim(),
          author: message.author.username,
          authorId: userId,
          submittedAt: new Date().toISOString(),
          status: 'pending',
          reviewedAt: null,
          reviewedBy: null
        };

        data.stats.totalRequests++;
        data.stats.pendingRequests++;

        await saveRequestData(data);
        requestCooldowns.set(cooldownKey, now);

        await message.reply(`📝 **Request #${requestId} submitted successfully!**\n\n**Description:** ${description}\n**Status:** Pending Review\n\nUse \`!request status ${requestId}\` to check the status of your request.`);

        logger.info(`${message.author.tag} submitted feature request #${requestId}`);
      }
    }

  } catch (error) {
    logger.error(`Error handling request command: ${error.message}`);
    await message.reply('❌ An error occurred while processing the request command.');
  }
}

// RPG command handlers
async function handleRPGCommands(message) {
  if (!message.content.startsWith('!rpg')) return;

  const args = message.content.split(' ');
  const subCommand = args[1]?.toLowerCase();
  const userId = message.author.id;
  const channelId = message.channel.id;

  try {
    const playersData = await loadRPGData('players');
    const channelsData = await loadRPGData('channels');

    switch (subCommand) {
      case 'start': {
        if (!message.member.permissions.has('Administrator')) {
          await message.reply('❌ This command requires administrator permissions.');
          return;
        }

        const channel = message.mentions.channels.first() || message.channel;

        if (channelsData.activeChannels[channel.id]) {
          await message.reply(`❌ RPG is already active in ${channel}!`);
          return;
        }

        channelsData.activeChannels[channel.id] = {
          startedBy: userId,
          startedAt: new Date().toISOString(),
          playerCount: 0
        };

        await saveRPGData('channels', channelsData);
        await message.reply(`🎮 RPG activated in ${channel}! Players can now join with \`!rpg join\``);
        logger.info(`Admin ${message.author.tag} started RPG in ${channel.name}`);
        break;
      }

      case 'stop': {
        if (!message.member.permissions.has('Administrator')) {
          await message.reply('❌ This command requires administrator permissions.');
          return;
        }

        const channel = message.mentions.channels.first() || message.channel;

        if (!channelsData.activeChannels[channel.id]) {
          await message.reply(`❌ RPG is not active in ${channel}!`);
          return;
        }

        delete channelsData.activeChannels[channel.id];
        await saveRPGData('channels', channelsData);
        await message.reply(`🎮 RPG deactivated in ${channel}!`);
        logger.info(`Admin ${message.author.tag} stopped RPG in ${channel.name}`);
        break;
      }

      case 'join': {
        if (!channelsData.activeChannels[channelId]) {
          await message.reply('❌ RPG is not active in this channel! Ask an admin to start it with `!rpg start`');
          return;
        }

        if (playersData.players[userId]) {
          await message.reply('❌ You are already in the RPG!');
          return;
        }

        playersData.players[userId] = {
          ...playersData.settings.startingStats,
          username: message.author.username,
          joinedAt: new Date().toISOString(),
          inventory: [],
          lastAction: null
        };

        channelsData.activeChannels[channelId].playerCount++;
        await saveRPGData('players', playersData);
        await saveRPGData('channels', channelsData);

        await message.reply(`🎮 Welcome to the RPG, ${message.author.username}! You are now a Level 1 Adventurer with ${playersData.settings.startingStats.health} HP, ${playersData.settings.startingStats.attack} ATK, and ${playersData.settings.startingStats.gold} gold!`);
        logger.info(`${message.author.tag} joined the RPG`);
        break;
      }

      case 'stats': {
        const player = playersData.players[userId];
        if (!player) {
          await message.reply('❌ You are not in the RPG! Use `!rpg join` to join.');
          return;
        }

        const statsMessage = `📊 **${player.username}'s Stats:**
• Level: ${player.level}
• HP: ${player.health}
• Attack: ${player.attack}
• Defense: ${player.defense}
• Gold: ${player.gold}
• Experience: ${player.experience}`;

        await message.reply(statsMessage);
        break;
      }

      case 'inventory': {
        const player = playersData.players[userId];
        if (!player) {
          await message.reply('❌ You are not in the RPG! Use `!rpg join` to join.');
          return;
        }

        const inventory = player.inventory.length > 0 ? player.inventory.join(', ') : 'Empty';
        await message.reply(`🎒 **${player.username}'s Inventory:** ${inventory}`);
        break;
      }

      case 'explore': {
        const player = playersData.players[userId];
        if (!player) {
          await message.reply('❌ You are not in the RPG! Use `!rpg join` to join.');
          return;
        }

        // Check cooldown
        const now = Date.now();
        const cooldownKey = `explore_${userId}`;
        const cooldownTime = playersData.settings.combatCooldown * 1000;

        if (rpgCooldowns.has(cooldownKey)) {
          const lastUsed = rpgCooldowns.get(cooldownKey);
          if (now - lastUsed < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
            await message.reply(`⏰ Please wait ${remaining} seconds before exploring again.`);
            return;
          }
        }

        // Random exploration results
        const results = [
          { type: 'gold', amount: Math.floor(Math.random() * 20) + 10, message: 'You found some gold!' },
          { type: 'health', amount: Math.floor(Math.random() * 30) + 10, message: 'You found a health potion!' },
          { type: 'item', item: 'Wooden Sword', message: 'You found a wooden sword!' },
          { type: 'experience', amount: Math.floor(Math.random() * 50) + 25, message: 'You gained experience!' },
          { type: 'nothing', message: 'You found nothing of interest.' }
        ];

        const result = results[Math.floor(Math.random() * results.length)];

        switch (result.type) {
          case 'gold':
            player.gold += result.amount;
            break;
          case 'health':
            player.health = Math.min(100, player.health + result.amount);
            break;
          case 'item':
            player.inventory.push(result.item);
            break;
          case 'experience':
            player.experience += result.amount;
            // Simple level up check
            const nextLevelExp = player.level * 100;
            if (player.experience >= nextLevelExp) {
              player.level++;
              player.attack += 2;
              player.defense += 1;
              await message.reply('🎉 You leveled up!');
            }
            break;
        }

        player.lastAction = new Date().toISOString();
        await saveRPGData('players', playersData);
        rpgCooldowns.set(cooldownKey, now);

        await message.reply(`🗺️ ${result.message} ${result.amount ? `(+${result.amount})` : ''}`);
        break;
      }

      case 'fight': {
        const player = playersData.players[userId];
        if (!player) {
          await message.reply('❌ You are not in the RPG! Use `!rpg join` to join.');
          return;
        }

        const targetUser = message.mentions.users.first();
        if (!targetUser) {
          await message.reply('❌ Please mention a user to fight! Usage: `!rpg fight @user`');
          return;
        }

        const targetId = targetUser.id;
        const targetPlayer = playersData.players[targetId];

        if (!targetPlayer) {
          await message.reply('❌ That user is not in the RPG!');
          return;
        }

        if (targetId === userId) {
          await message.reply('❌ You cannot fight yourself!');
          return;
        }

        // Check cooldown
        const now = Date.now();
        const cooldownKey = `fight_${userId}`;
        const cooldownTime = playersData.settings.combatCooldown * 1000;

        if (rpgCooldowns.has(cooldownKey)) {
          const lastUsed = rpgCooldowns.get(cooldownKey);
          if (now - lastUsed < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
            await message.reply(`⏰ Please wait ${remaining} seconds before fighting again.`);
            return;
          }
        }

        // Simple combat calculation
        const playerAttack = Math.max(1, player.attack - targetPlayer.defense);
        const targetAttack = Math.max(1, targetPlayer.attack - player.defense);

        const playerDamage = Math.floor(Math.random() * playerAttack) + 1;
        const targetDamage = Math.floor(Math.random() * targetAttack) + 1;

        player.health -= targetDamage;
        targetPlayer.health -= playerDamage;

        let resultMessage = `⚔️ **Combat Results:**\n`;
        resultMessage += `${player.username} deals ${playerDamage} damage to ${targetPlayer.username}!\n`;
        resultMessage += `${targetPlayer.username} deals ${targetDamage} damage to ${player.username}!\n\n`;

        // Check if anyone died
        if (player.health <= 0 && targetPlayer.health <= 0) {
          resultMessage += `💀 It's a tie! Both players are defeated.`;
          player.health = 1;
          targetPlayer.health = 1;
        } else if (player.health <= 0) {
          resultMessage += `💀 ${player.username} has been defeated!`;
          player.health = 1; // Don't let health go to 0
          targetPlayer.gold += Math.floor(player.gold * 0.1);
          player.gold = Math.floor(player.gold * 0.9);
        } else if (targetPlayer.health <= 0) {
          resultMessage += `🎉 ${player.username} wins the battle!`;
          targetPlayer.health = 1; // Don't let health go to 0
          player.gold += Math.floor(targetPlayer.gold * 0.1);
          targetPlayer.gold = Math.floor(targetPlayer.gold * 0.9);
        } else {
          resultMessage += `Both players survive the battle!`;
        }

        player.lastAction = new Date().toISOString();
        targetPlayer.lastAction = new Date().toISOString();

        await saveRPGData('players', playersData);
        rpgCooldowns.set(cooldownKey, now);

        await message.reply(resultMessage);
        break;
      }

      default:
        const helpMessage = `🎮 **RPG Commands:**
• \`!rpg join\` - Join the RPG
• \`!rpg stats\` - Show your stats
• \`!rpg inventory\` - Show your inventory
• \`!rpg explore\` - Explore for items/gold
• \`!rpg fight @user\` - Fight another player

**Admin Commands:**
• \`!rpg start [channel]\` - Start RPG in channel
• \`!rpg stop [channel]\` - Stop RPG in channel`;

        await message.reply(helpMessage);
    }

  } catch (error) {
    logger.error(`Error handling RPG command: ${error.message}`);
    await message.reply('❌ An error occurred while processing the RPG command.');
  }
}

// Admin commands for image macros
async function handleMacroAdmin(message) {
  if (!message.content.startsWith('!macro')) return;
  if (!message.member.permissions.has('Administrator')) {
    await message.reply('❌ This command requires administrator permissions.');
    return;
  }

  const args = message.content.split(' ');
  const subCommand = args[1]?.toLowerCase();

  try {
    const data = await loadImageMacros();

    switch (subCommand) {
      case 'add': {
        const keyword = args[2]?.toLowerCase();
        const url = args[3];

        if (!keyword || !url) {
          await message.reply('Usage: `!macro add <keyword> <imgur_url>`');
          return;
        }

        if (!isValidImgurUrl(url)) {
          await message.reply('❌ Invalid imgur.com URL. Only imgur.com links are allowed.');
          return;
        }

        if (data.macros[keyword]) {
          await message.reply(`❌ Macro "${keyword}" already exists.`);
          return;
        }

        // Check if user has reached limit
        const userMacros = Object.values(data.macros).filter(m => m.addedBy === message.author.id).length;
        if (userMacros >= data.settings.maxMacrosPerUser) {
          await message.reply(`❌ You've reached the maximum of ${data.settings.maxMacrosPerUser} macros per user.`);
          return;
        }

        data.macros[keyword] = {
          url: url,
          addedBy: message.author.id,
          addedAt: new Date().toISOString(),
          usageCount: 0,
          lastUsed: null
        };

        await saveImageMacros(data);
        await message.reply(`✅ Image macro "${keyword}" added successfully!`);
        logger.info(`Admin ${message.author.tag} added macro "${keyword}"`);
        break;
      }

      case 'remove': {
        const keyword = args[2]?.toLowerCase();

        if (!keyword) {
          await message.reply('Usage: `!macro remove <keyword>`');
          return;
        }

        if (!data.macros[keyword]) {
          await message.reply(`❌ Macro "${keyword}" doesn't exist.`);
          return;
        }

        delete data.macros[keyword];
        await saveImageMacros(data);
        await message.reply(`✅ Image macro "${keyword}" removed successfully!`);
        logger.info(`Admin ${message.author.tag} removed macro "${keyword}"`);
        break;
      }

      case 'list': {
        const macros = Object.entries(data.macros);
        if (macros.length === 0) {
          await message.reply('📝 No image macros configured.');
          return;
        }

        let response = '📝 **Image Macros:**\n';
        macros.forEach(([keyword, macro]) => {
          response += `• !!${keyword} → ${macro.url}\n`;
        });
        await message.reply(response);
        break;
      }

      default:
        await message.reply('Available commands:\n• `!macro add <keyword> <url>` - Add macro\n• `!macro remove <keyword>` - Remove macro\n• `!macro list` - List all macros');
    }

  } catch (error) {
    logger.error(`Error handling macro admin command: ${error.message}`);
    await message.reply('❌ An error occurred while processing the command.');
  }
}

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
client.once('ready', async () => {
  logger.info(`Bot is ready! Logged in as ${client.user.tag}`);
  logger.info(`Bot is monitoring ${client.guilds.cache.size} servers`);

  // Set bot username to configured name
  try {
    await client.user.setUsername(config.name);
    logger.info(`Bot username set to ${config.name}`);
  } catch (error) {
    logger.error(`Failed to set bot username to ${config.name}: ${error.message}`);
  }
});

// Event: Message received
client.on('messageCreate', async (message) => {
  try {
    // Ignore bot messages and messages without content
    if (message.author.bot || !message.content) return;

    // Handle admin commands first
    if (message.content.startsWith('!macro')) {
      await handleMacroAdmin(message);
      return;
    }

    // Handle RPG commands
    if (message.content.startsWith('!rpg')) {
      await handleRPGCommands(message);
      return;
    }

    // Handle request commands
    if (message.content.startsWith('!request')) {
      await handleRequestCommands(message);
      return;
    }

    // Handle image macro triggers
    if (message.content.startsWith('!!')) {
      await handleImageMacro(message);
      return;
    }

    // Check rate limit for link processing
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