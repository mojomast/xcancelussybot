# 🚀 **xcancelussybot** by kyle durepos

<div align="center">

![xcancelussybot](https://img.shields.io/badge/xcancelussybot-v2.0.0-blue?style=for-the-badge)
![Discord.js](https://img.shields.io/badge/discord.js-14.14.1-5865F2?style=for-the-badge&logo=discord)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

*🔗 The ultimate multi-platform link converter bot for Discord - Rob the parasites of engagement!*
*💡 Idea by: `CQ'); DROP TABLE Channels;--`*
*🎮 Coming in v0.2: Image Macros, RPG Games, Feature Requests!*

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

</div>

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

## 🚀 **v0.2 Preview - Coming Soon!**

### 🎨 **Image Macro System**
- Store imgur.com images with custom keywords
- Trigger with `!!keyword` commands
- Admin controls for macro management
- Rate limiting and validation

### 🎮 **Idler-Style RPG Game**
- Admin-activated RPG channels
- Player stats, inventory, and combat
- Turn-based PvP system
- Exploration and shop mechanics

### 📝 **Bot Feature Requests**
- User submission system for new features
- Admin review and approval workflow
- Request tracking and status updates
- Community-driven development

*See `version0.2dev.md` for detailed development roadmap!*

---