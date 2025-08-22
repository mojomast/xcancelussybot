/**
 * Configuration Management Module
 * Centralizes all bot configuration and environment variable handling
 */

const path = require('path');

// Bot configuration
const config = {
  token: process.env.DISCORD_TOKEN,
  prefix: process.env.BOT_PREFIX || '!',
  logLevel: process.env.LOG_LEVEL || 'info',
  maxRepliesPerMinute: parseInt(process.env.MAX_REPLIES_PER_MINUTE) || 30
};

// Platform toggle settings
function getPlatformSettings() {
  return {
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
}

// Site mappings configuration
function getSiteMappings() {
  const platformSettings = getPlatformSettings();
  const mappings = new Map();

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

// Image macro settings
function getImageMacroSettings() {
  return {
    maxMacrosPerUser: parseInt(process.env.MAX_MACROS_PER_USER) || 5,
    cooldownSeconds: parseInt(process.env.MACRO_COOLDOWN_SECONDS) || 30,
    allowedDomains: ['imgur.com', 'i.imgur.com', 'www.imgur.com']
  };
}

// RPG settings
function getRPGSettings() {
  return {
    maxPlayersPerChannel: parseInt(process.env.RPG_MAX_PLAYERS_PER_CHANNEL) || 20,
    combatCooldown: parseInt(process.env.RPG_COMBAT_COOLDOWN) || 60,
    startingStats: {
      health: 100,
      attack: 10,
      defense: 5,
      gold: 50,
      level: 1,
      experience: 0
    }
  };
}

// File paths
const DATA_DIR = path.join(process.cwd(), 'data');
const MACRO_FILE = path.join(DATA_DIR, 'image_macros.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const RPG_PLAYERS_FILE = path.join(DATA_DIR, 'rpg', 'players.json');
const RPG_CHANNELS_FILE = path.join(DATA_DIR, 'rpg', 'channels.json');
const RPG_GAME_STATE_FILE = path.join(DATA_DIR, 'rpg', 'game_state.json');

// Validation functions
function validateConfig() {
  const errors = [];

  if (!config.token) {
    errors.push('DISCORD_TOKEN is required in environment variables');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  config,
  getPlatformSettings,
  getSiteMappings,
  getImageMacroSettings,
  getRPGSettings,
  validateConfig,
  paths: {
    DATA_DIR,
    MACRO_FILE,
    REQUESTS_FILE,
    RPG_PLAYERS_FILE,
    RPG_CHANNELS_FILE,
    RPG_GAME_STATE_FILE
  }
};