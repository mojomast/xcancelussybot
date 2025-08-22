# 🚀 **xcancelussybot** by kyle durepos

<div align="center">

![xcancelussybot](https://img.shields.io/badge/xcancelussybot-v2.0.0-blue?style=for-the-badge)
![Discord.js](https://img.shields.io/badge/discord.js-14.14.1-5865F2?style=for-the-badge&logo=discord)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

*🔗 The ultimate multi-platform link converter bot for Discord - Rob the parasites of engagement!*
*💡 Idea by: `CQ'); DROP TABLE Channels;--`*
*🎮 v0.2 COMPLETE: Image Macros, RPG System, Bot Requests!*
*🚀 v0.3 IN DEVELOPMENT: Modular Architecture, Advanced RPG, Moderation System!*

</div>

---

## ✨ **Features**

<div align="center">

| 🚀 Feature | Description |
|------------|-------------|
| **🎯 Smart Detection** | Advanced regex scanning for 10+ platform URLs (Twitter, Instagram, TikTok, Threads, YouTube, Facebook, Reddit, LinkedIn, Pinterest, Snapchat) |
| **⚡ Instant Replies** | Lightning-fast responses with alternative links to rob the parasites of engagement |
| **🛡️ Rate Limiting** | Anti-spam protection with configurable limits |
| **🔧 Error Handling** | Robust handling of malformed URLs and edge cases |
| **📊 Logging** | Comprehensive logging for monitoring and debugging |
| **⚙️ Configurable** | Environment-based setup for easy deployment and custom platform mappings |
| **🔄 Multi-Platform** | Support for Twitter(X), Instagram, TikTok, Threads, and more with easy configuration |
| **🎨 Image Macros** | Custom keyword-triggered imgur images with admin management |
| **🎮 RPG System** | Turn-based RPG game playable in Discord channels |
| **📝 Feature Requests** | Community-driven development with user request submission |

</div>

---

## 📈 **Development Status**

### **✅ v0.2 COMPLETE (100% Complete)**
- ✅ Platform toggle configuration system
- ✅ Image macro system with keyword triggers
- ✅ Full-featured RPG with combat and progression
- ✅ Community feature request system
- ✅ Comprehensive documentation
- ✅ All tests passing

### **🚧 v0.3 IN PROGRESS (Architecture Phase)**
- ✅ Modular architecture foundation created
- ✅ Detailed 5-week development plan established
- ✅ **Week 1 COMPLETE**: Core modular architecture implemented
- 🔄 Code modularization (Week 1) - **896 lines of modular code created**
- ⏳ Enhanced RPG features (Week 2)
- ⏳ Moderation system (Week 3)
- ⏳ Analytics & UX improvements (Week 4)
- ⏳ Production testing (Week 5)

### **🎯 Current Focus**
- **High Priority**: Code quality and architecture improvements
- **Next Phase**: Advanced RPG features (character classes, items, quests)
- **Timeline**: 5-week development cycle with weekly milestones

---

## 🏗️ **v0.3 Modular Architecture - Week 1 Complete!**

### **📊 Architecture Achievements**
- ✅ **5 Core Modules Created**: 896 lines of modular code
- ✅ **Configuration System**: Centralized settings management
- ✅ **Advanced Logging**: File-based logging with performance tracking
- ✅ **Database Layer**: Robust JSON management with caching
- ✅ **Rate Limiting**: Comprehensive spam prevention system
- ✅ **Permissions Framework**: Discord permission validation

### **📁 New Modular Structure**
```
src/
├── config/
│   └── index.js              # Bot configuration & platform toggles
├── utils/
│   ├── logger.js             # Advanced logging system
│   ├── database.js           # JSON file management with caching
│   ├── rate_limiter.js       # Cooldowns and spam prevention
│   └── permissions.js        # Discord permission validation
└── features/                 # Ready for feature modules
    └── [upcoming modules]    # RPG, macros, requests, moderation
```

### **🚀 Architecture Benefits**
- **Maintainability**: Code organized into logical modules
- **Scalability**: Easy to add new features and systems
- **Testability**: Individual modules can be tested independently
- **Performance**: Optimized caching and rate limiting
- **Reliability**: Comprehensive error handling and logging

### 🎮 **How It Works**

```
User: Check out this tweet! https://x.com/example/1234567890
Bot:  🔗 **Alternative links:**
      1. https://xcancel.com/example/1234567890

User: Nice Instagram post! https://instagram.com/example/post123
Bot:  🔗 **Alternative links:**
      1. https://imginn.com/example/post123

User: This TikTok is amazing! https://tiktok.com/@user/video/1234567890
Bot:  🔗 **Alternative links:**
      1. https://snaptik.app/@user/video/1234567890
```

## 🛠️ **Quick Setup**

### 📋 **Prerequisites**
- 🟢 Node.js 16.0.0 or higher
- 🤖 Discord bot token from [Developer Portal](https://discord.com/developers/applications)

### ⚡ **Installation**

<div align="center">

```bash
# Clone the repo
git clone <repository-url>
cd xcancelussy

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

</div>

### 🔧 **Configuration**

Edit your `.env` file with these settings:

```env
# 🔑 Required
DISCORD_TOKEN=your_discord_bot_token_here

# ⚙️ Optional Settings
BOT_PREFIX=!
LOG_LEVEL=info
MAX_REPLIES_PER_MINUTE=30

# 🔗 Platform Mappings (SOURCE_DOMAIN=TARGET_DOMAIN)
# Default mappings are included, but you can override or add custom ones:
X_COM=xcancel.com
INSTAGRAM_COM=imginn.com
TIKTOK_COM=snaptik.app
THREADS_NET=photomate.online

# Add custom mappings as needed:
# FACEBOOK_COM=alternative-site.com
# YOUTUBE_COM=alternative-site.com
```

### 🤖 **Discord Bot Setup**

1. **Create Application** → [Discord Developer Portal](https://discord.com/developers/applications)
2. **Create Bot** → Go to "Bot" section and create your bot
3. **Enable Intents** → Turn on "Message Content Intent"
4. **Copy Token** → Get your bot token for `.env`
5. **Invite Bot** → Generate invite URL with appropriate permissions:
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot
   ```

### 🚀 **Running xcancelussy**

<div align="center">

| Mode | Command | Description |
|------|---------|-------------|
| **Development** | `npm run dev` | Hot reload with nodemon |
| **Production** | `npm start` | Production-ready launch |

</div>

**That's it!** 🎉 Your bot is now scanning for x.com links and providing xcancel.com alternatives!

## How It Works

1. **Link Detection**: The bot uses dynamic regex to find supported platform URLs in messages
2. **URL Conversion**: Converts URLs using configurable mappings for 10+ platforms (Twitter, Instagram, TikTok, Threads, YouTube, Facebook, Reddit, LinkedIn, Pinterest, Snapchat)
3. **Automatic Reply**: Responds with alternative links in a formatted message
4. **Rate Limiting**: Ensures users can't trigger excessive replies
5. **Multi-Platform Support**: Easily extensible to support new platforms via environment configuration

### Examples

**User Message:**
```
Check out this tweet: https://x.com/example/1234567890
```

**Bot Reply:**
```
🔗 **Alternative links:**
1. https://xcancel.com/example/1234567890
```

**User Message:**
```
Nice Instagram post! https://instagram.com/example/post123
```

**Bot Reply:**
```
🔗 **Alternative links:**
1. https://imginn.com/example/post123
```

**User Message:**
```
This TikTok is amazing! https://tiktok.com/@user/video/1234567890
```

**Bot Reply:**
```
🔗 **Alternative links:**
1. https://snaptik.app/@user/video/1234567890
```

**User Message:**
```
Check out this YouTube video: https://youtube.com/watch?v=abc123
```

**Bot Reply:**
```
🔗 **Alternative links:**
1. https://ytb.trom.tf/watch?v=abc123
```

**User Message:**
```
Reddit discussion: https://reddit.com/r/technology/comments/xyz
```

**Bot Reply:**
```
🔗 **Alternative links:**
1. https://teddit.net/r/technology/comments/xyz
```

## ⚙️ **Configuration Options**

<div align="center">

| 🔧 Variable | 📝 Description | ⚡ Default | 🔴 Required |
|-------------|---------------|-----------|-------------|
| `DISCORD_TOKEN` | Your Discord bot token | - | ✅ |
| `BOT_PREFIX` | Command prefix | `!` | ❌ |
| `LOG_LEVEL` | Logging verbosity | `info` | ❌ |
| `MAX_REPLIES_PER_MINUTE` | Anti-spam rate limit | `30` | ❌ |
| `X_COM` | Alternative for x.com URLs | `xcancel.com` | ❌ |
| `INSTAGRAM_COM` | Alternative for Instagram URLs | `imginn.com` | ❌ |
| `TIKTOK_COM` | Alternative for TikTok URLs | `snaptik.app` | ❌ |
| `THREADS_NET` | Alternative for Threads URLs | `photomate.online` | ❌ |
| `YOUTUBE_COM` | Alternative for YouTube URLs | `ytb.trom.tf` | ❌ |
| `FACEBOOK_COM` | Alternative for Facebook URLs | `mbasic.facebook.com` | ❌ |
| `REDDIT_COM` | Alternative for Reddit URLs | `teddit.net` | ❌ |
| `LINKEDIN_COM` | Alternative for LinkedIn URLs | `libredd.it` | ❌ |
| `PINTEREST_COM` | Alternative for Pinterest URLs | `pin.it` | ❌ |
| `SNAPCHAT_COM` | Alternative for Snapchat URLs | `snapinsta.app` | ❌ |

## 🎨 **Image Macro System (v0.2)**

Store and trigger imgur.com images with custom keywords!

| 🎨 Command | Description | Permission Required |
|------------|-------------|-------------------|
| `!!<keyword>` | Trigger image macro | None (all users) |
| `!macro add <keyword> <imgur_url>` | Add new image macro | Administrator |
| `!macro remove <keyword>` | Remove image macro | Administrator |
| `!macro list` | List all macros | Administrator |

### **Image Macro Examples**
```
Admin: !macro add "doge" https://imgur.com/doge123
Bot: ✅ Image macro "doge" added successfully!

User: !!doge
Bot: [Posts the doge image]

Admin: !macro list
Bot: 📝 **Image Macros:**
     • !!doge → https://imgur.com/doge123
     • !!cat → https://imgur.com/cat456
```

### **Image Macro Settings**
| 🔧 Variable | 📝 Description | ⚡ Default | 🔴 Required |
|-------------|---------------|-----------|-------------|
| `MAX_MACROS_PER_USER` | Max macros per user | `5` | ❌ |
| `MACRO_COOLDOWN_SECONDS` | Cooldown between uses | `30` | ❌ |

## 🎮 **RPG System (v0.2)**

Turn-based RPG game playable in Discord channels!

| 🎮 Command | Description | Permission Required |
|------------|-------------|-------------------|
| `!rpg start [channel]` | Start RPG in channel | Administrator |
| `!rpg stop [channel]` | Stop RPG in channel | Administrator |
| `!rpg join` | Join the RPG game | None (all users) |
| `!rpg stats` | Show your player stats | None |
| `!rpg inventory` | Show your inventory | None |
| `!rpg explore` | Explore for items/gold | None |
| `!rpg fight @user` | Fight another player | None |

### **RPG Examples**
```
Admin: !rpg start #adventure-channel
Bot: 🎮 RPG activated in #adventure-channel! Players can now join with `!rpg join`

User: !rpg join
Bot: 🎮 Welcome to the RPG, username! You are now a Level 1 Adventurer with 100 HP, 10 ATK, and 50 gold!

User: !rpg explore
Bot: 🗺️ You found some gold! (+25)

User: !rpg fight @otheruser
Bot: ⚔️ **Combat Results:**
     username deals 12 damage to otheruser!
     otheruser deals 8 damage to username!
     Both players survive the battle!
```

### **RPG Settings**
| 🔧 Variable | 📝 Description | ⚡ Default | 🔴 Required |
|-------------|---------------|-----------|-------------|
| `RPG_MAX_PLAYERS_PER_CHANNEL` | Max players per channel | `20` | ❌ |
| `RPG_COMBAT_COOLDOWN` | Cooldown between actions | `60` | ❌ |

## 📝 **Bot Feature Requests (v0.2)**

Allow users to submit feature requests for bot development!

| 📝 Command | Description | Permission Required |
|------------|-------------|-------------------|
| `!request <description>` | Submit feature request | None (all users) |
| `!request list` | List all requests | None |
| `!request status <id>` | Check request status | None |
| `!request approve <id>` | Approve request | Administrator |

### **Bot Request Examples**
```
User: !request Add support for GIF macros
Bot: 📝 **Request #42 submitted successfully!**
     Description: Add support for GIF macros
     Status: Pending Review
     Use `!request status 42` to check the status of your request.

User: !request status 42
Bot: 📊 **Request #42 Status:**
     Description: Add support for GIF macros
     Status: PENDING
     Author: username
     Submitted: 1/22/2025

Admin: !request approve 42
Bot: ✅ Request #42 approved! The feature "Add support for GIF macros" will be considered for implementation.

User: !request list
Bot: 📋 **Feature Requests:**
     ⏳ **#42**: Add support for GIF macros - by username
     ✅ **#41**: Fix image macro cooldown - by otheruser
```

## ⚙️ **Platform Toggle Configuration (v0.2)**

Control which platforms the bot will monitor and convert:

| 🔧 Toggle Variable | 📝 Description | ⚡ Default | 🔴 Required |
|-------------------|---------------|-----------|-------------|
| `ENABLE_X_COM` | Enable Twitter(X) URL conversion | `true` | ❌ |
| `ENABLE_INSTAGRAM_COM` | Enable Instagram URL conversion | `true` | ❌ |
| `ENABLE_TIKTOK_COM` | Enable TikTok URL conversion | `true` | ❌ |
| `ENABLE_THREADS_NET` | Enable Threads URL conversion | `true` | ❌ |
| `ENABLE_YOUTUBE_COM` | Enable YouTube URL conversion | `true` | ❌ |
| `ENABLE_FACEBOOK_COM` | Enable Facebook URL conversion | `true` | ❌ |
| `ENABLE_REDDIT_COM` | Enable Reddit URL conversion | `true` | ❌ |
| `ENABLE_LINKEDIN_COM` | Enable LinkedIn URL conversion | `true` | ❌ |
| `ENABLE_PINTEREST_COM` | Enable Pinterest URL conversion | `true` | ❌ |
| `ENABLE_SNAPCHAT_COM` | Enable Snapchat URL conversion | `true` | ❌ |

### **Platform Toggle Example**
```env
# Disable specific platforms
ENABLE_YOUTUBE_COM=false
ENABLE_FACEBOOK_COM=false
ENABLE_LINKEDIN_COM=false

# Keep others enabled
ENABLE_X_COM=true
ENABLE_INSTAGRAM_COM=true
ENABLE_TIKTOK_COM=true
```

</div>

## 🔍 **Troubleshooting**

### 🚨 **Common Issues**

<div align="center">

| ❌ Problem | 🔧 Solution |
|------------|-------------|
| **"Discord client error"** | Verify token correctness and bot permissions |
| **"Rate limit exceeded"** | Reduce bot activity or check server permissions |
| **No responses to x.com links** | Enable "Message Content Intent" in Developer Portal |
| **Bot offline** | Check token validity and network connection |

</div>

### 📊 **Debugging**

xcancelussy provides detailed logging:
```bash
# Check console output for debugging info
npm run dev  # Development mode with hot reload
```

## 🚀 **Deployment**

### 🖥️ **Local Development**
```bash
# Quick start
npm install && cp .env.example .env
# Edit .env with your token
npm start
```

### ☁️ **Production Deployment**

<div align="center">

#### **Option 1: PM2 (Recommended)**
```bash
npm install -g pm2
pm2 start bot.js --name "xcancelussy"
pm2 save
pm2 startup
```

#### **Option 2: Docker**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

</div>

## 👥 **Credits & Thanks**

- **🤖 Bot Creator**: kyle durepos
- **💡 Original Idea**: `CQ'); DROP TABLE Channels;--`
- **🔧 Built with**: discord.js, Node.js
- **🎨 README Styling**: Powered by markdown magic

## 📄 **License**

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**xcancelussy** is released under the MIT License. Feel free to use, modify, and distribute!

</div>

---

<div align="center">

**Made with ❤️ by kyle durepos**

*🔗 Robbing the parasites of engagement since 2025*

</div>

---

## ✅ **v0.2 COMPLETE - All Features Live!**

### 🎨 **Image Macro System** ✅
- Store imgur.com images with custom keywords
- Trigger with `!!keyword` commands
- Admin controls for macro management
- Rate limiting and validation

### 🎮 **Idler-Style RPG Game** ✅
- Admin-activated RPG channels
- Player stats, inventory, and combat
- Turn-based PvP system
- Exploration and shop mechanics

### 📝 **Bot Feature Requests** ✅
- User submission system for new features
- Admin review and approval workflow
- Request tracking and status updates
- Community-driven development

## 🚀 **v0.3 IN DEVELOPMENT - Next Level Features!**

### 🏗️ **Modular Architecture Overhaul**
- Split 982-line bot.js into organized modules
- Enhanced error handling and logging
- Input validation and sanitization
- Performance optimizations

### ⚔️ **Advanced RPG System**
- Character classes (Warrior, Mage, Rogue)
- Item system with weapons/armor/consumables
- Quest system with story progression
- Dynamic shop with item trading
- Enhanced combat with skills and spells

### 🛡️ **Moderation & Safety**
- Anti-spam detection and filtering
- Auto-moderation with rule engine
- Warning/timeout system
- Content filtering for inappropriate material
- Audit logging for admin actions

### 📊 **Analytics & Insights**
- Usage tracking and reporting
- Command popularity metrics
- User engagement analytics
- Performance monitoring
- Error tracking system

### 🎯 **Enhanced User Experience**
- Rich embeds and visual improvements
- Interactive help system
- Achievement system with badges
- Command aliases and shortcuts
- Personalization options

*See `version0.3dev.md` for detailed development roadmap!*

---