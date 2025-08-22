# 🚀 **xcancelussybot v0.2 Development Plan**

## 📋 **Overview**
This document outlines the development roadmap for version 0.2 of xcancelussybot, focusing on enhanced functionality, user engagement features, and improved configurability.

---

## 🎯 **Core Features (v0.2.0)**

### 1. **Platform Toggle Configuration** ✅
- **Status**: In Development
- **Description**: Add environment variables to enable/disable individual platforms
- **Files to Modify**: `.env.example`, `bot.js`, `README.md`
- **Configuration Variables**:
  - `ENABLE_X_COM=true/false`
  - `ENABLE_INSTAGRAM_COM=true/false`
  - `ENABLE_TIKTOK_COM=true/false`
  - `ENABLE_THREADS_NET=true/false`
  - `ENABLE_YOUTUBE_COM=true/false`
  - `ENABLE_FACEBOOK_COM=true/false`
  - `ENABLE_REDDIT_COM=true/false`
  - `ENABLE_LINKEDIN_COM=true/false`
  - `ENABLE_PINTEREST_COM=true/false`
  - `ENABLE_SNAPCHAT_COM=true/false`

### 2. **Image Macro System** ⏳
- **Status**: Planned
- **Description**: Users can store imgur.com images with keywords and trigger them with !!keyword
- **Components**:
  - JSON storage system for image macros
  - Admin commands for managing macros
  - User command `!!keyword` for triggering
  - Imgur link validation
  - Rate limiting for macro usage

### 3. **Idler-Style RPG Game** ⏳
- **Status**: Planned
- **Description**: Text-based RPG system that runs in specific Discord channels
- **Features**:
  - Admin activation/deactivation per channel
  - User stats and inventory system
  - Turn-based combat system
  - Exploration and quest mechanics
  - Player vs Player interactions
  - JSON-based save system

### 4. **Bot Requests Feature** ⏳
- **Status**: Planned
- **Description**: Allow users to submit feature requests for bot development
- **Components**:
  - User request submission system
  - Admin review and approval workflow
  - Request tracking and status updates
  - Request voting system (optional)
  - Integration with GitHub issues

---

## 🏗️ **Technical Architecture**

### **Data Storage Strategy**
```
data/
├── image_macros.json      # Image macro storage
├── rpg/
│   ├── players.json       # Player stats and inventory
│   ├── channels.json      # Active RPG channels
│   └── game_state.json    # Current game state
└── requests.json          # Feature requests
```

### **Command Structure**
```
/ Core Bot Features
├── !help                  # Show available commands
├── !stats                 # Bot statistics
└── !config                # Show current configuration

/ Image Macros
├── !macro add <keyword> <imgur_url>    # Add image macro (admin only)
├── !macro remove <keyword>             # Remove macro (admin only)
├── !macro list                         # List all macros (admin only)
└── !!<keyword>                         # Trigger macro (all users)

/ RPG System
├── !rpg start <channel>                # Start RPG in channel (admin only)
├── !rpg stop <channel>                 # Stop RPG in channel (admin only)
├── !rpg join                           # Join RPG game
├── !rpg stats                          # Show player stats
├── !rpg inventory                      # Show inventory
├── !rpg fight <player>                 # Fight another player
├── !rpg explore                        # Explore for items/resources
└── !rpg shop                           # Access shop system

/ Bot Requests
├── !request <feature_description>      # Submit feature request
├── !request list                       # List all requests
├── !request status <id>                # Check request status
└── !request approve <id>               # Approve request (admin only)
```

### **Permission System**
- **Admin Commands**: Require administrator permissions
- **User Commands**: Available to all users with rate limiting
- **Channel-Specific**: RPG features restricted to designated channels

---

## 📅 **Development Timeline**

### **Phase 1: Platform Configuration (Week 1)**
- [x] Add environment variables for platform toggles
- [x] Update bot.js to respect toggle settings
- [x] Update documentation
- [x] Test configuration system

### **Phase 2: Image Macro System (Week 2)**
- [ ] Design JSON storage system
- [ ] Implement admin commands for macro management
- [ ] Add !!keyword command handler
- [ ] Implement imgur URL validation
- [ ] Add rate limiting and error handling

### **Phase 3: RPG System (Week 3-4)**
- [ ] Design player data structure
- [ ] Implement admin channel activation
- [ ] Create basic RPG commands
- [ ] Add combat system
- [ ] Implement inventory and shop systems

### **Phase 4: Bot Requests (Week 5)**
- [ ] Design request tracking system
- [ ] Implement user submission commands
- [ ] Create admin review workflow
- [ ] Add request status tracking

### **Phase 5: Testing & Documentation (Week 6)**
- [ ] Comprehensive testing of all features
- [ ] Update README.md with new features
- [ ] Create user documentation
- [ ] Performance optimization

---

## 🔧 **Configuration Examples**

### **Environment Variables**
```env
# Platform Toggles (v0.2)
ENABLE_X_COM=true
ENABLE_INSTAGRAM_COM=true
ENABLE_TIKTOK_COM=true
ENABLE_THREADS_NET=true
ENABLE_YOUTUBE_COM=false
ENABLE_FACEBOOK_COM=false
ENABLE_REDDIT_COM=true
ENABLE_LINKEDIN_COM=false
ENABLE_PINTEREST_COM=true
ENABLE_SNAPCHAT_COM=false

# Image Macro Settings (v0.2)
MAX_MACROS_PER_USER=5
MACRO_COOLDOWN_SECONDS=30

# RPG Settings (v0.2)
RPG_MAX_PLAYERS_PER_CHANNEL=20
RPG_COMBAT_COOLDOWN=60
```

---

## 🎮 **Feature Usage Examples**

### **Image Macros**
```
User: !macro add "doge" https://imgur.com/doge123
Bot: ✅ Image macro "doge" added successfully!

User: !!doge
Bot: [Posts the doge image]
```

### **RPG System**
```
Admin: !rpg start #adventure-channel
Bot: 🎮 RPG activated in #adventure-channel!

User: !rpg join
Bot: Welcome to the RPG! You are now a Level 1 Adventurer.

User: !rpg explore
Bot: You found a health potion! (+10 HP)
```

### **Bot Requests**
```
User: !request Add support for Twitter polls
Bot: 📝 Request #42 submitted! Status: Pending Review

Admin: !request approve 42
Bot: ✅ Request #42 approved! Feature will be added in v0.3
```

---

## 🛡️ **Security & Rate Limiting**

### **Rate Limits**
- Image macros: 30 second cooldown per user
- RPG actions: 60 second cooldown per user
- Feature requests: 1 per hour per user

### **Validation**
- Imgur URLs must be valid and accessible
- RPG channel activation requires admin permissions
- Request descriptions limited to 500 characters

---

## 📊 **Success Metrics**

- **Platform Configuration**: 90% of users should be able to configure platforms
- **Image Macros**: Average 50+ macros per active server
- **RPG System**: 70% of servers with active RPG channels
- **Bot Requests**: 20+ feature requests per month

---

## 🚨 **Risks & Mitigations**

| Risk | Mitigation |
|------|------------|
| High server load from image macros | Implement aggressive rate limiting |
| RPG system complexity | Start with simple mechanics, expand gradually |
| Feature request spam | Implement user limits and admin review |
| Data storage corruption | Use atomic file operations and backups |

---

*This development plan is subject to change based on user feedback and technical requirements.*
*Last updated: 2025-01-22*