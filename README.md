# 🚀 **xcancelussy** by kyle durepos

<div align="center">

![xcancelussy](https://img.shields.io/badge/xcancelussy-v1.0.0-blue?style=for-the-badge)
![Discord.js](https://img.shields.io/badge/discord.js-14.14.1-5865F2?style=for-the-badge&logo=discord)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

*🔗 The ultimate x.com → xcancel.com converter bot for Discord*
*💡 Idea by: `CQ'); DROP TABLE Channels;--`*

</div>

---

## ✨ **Features**

<div align="center">

| 🚀 Feature | Description |
|------------|-------------|
| **🎯 Smart Detection** | Advanced regex scanning for x.com URLs in any context |
| **⚡ Instant Replies** | Lightning-fast responses with xcancel.com alternatives |
| **🛡️ Rate Limiting** | Anti-spam protection with configurable limits |
| **🔧 Error Handling** | Robust handling of malformed URLs and edge cases |
| **📊 Logging** | Comprehensive logging for monitoring and debugging |
| **⚙️ Configurable** | Environment-based setup for easy deployment |

</div>

### 🎮 **How It Works**

```
User: Check out this tweet! https://x.com/example/1234567890
Bot:  🔗 **Alternative links:**
     1. https://xcancel.com/example/1234567890
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

1. **Link Detection**: The bot uses regex to find x.com URLs in messages
2. **URL Conversion**: Converts `x.com/username/status/id` to `xcancel.com/username/status/id`
3. **Automatic Reply**: Responds with the converted links in a formatted message
4. **Rate Limiting**: Ensures users can't trigger excessive replies

### Example

**User Message:**
```
Check out this tweet: https://x.com/example/1234567890
```

**Bot Reply:**
```
🔗 **Alternative links:**
1. https://xcancel.com/example/1234567890
```

## ⚙️ **Configuration Options**

<div align="center">

| 🔧 Variable | 📝 Description | ⚡ Default | 🔴 Required |
|-------------|---------------|-----------|-------------|
| `DISCORD_TOKEN` | Your Discord bot token | - | ✅ |
| `BOT_PREFIX` | Command prefix | `!` | ❌ |
| `LOG_LEVEL` | Logging verbosity | `info` | ❌ |
| `MAX_REPLIES_PER_MINUTE` | Anti-spam rate limit | `30` | ❌ |

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

*🔗 Converting x.com links to xcancel.com since 2025*

</div>