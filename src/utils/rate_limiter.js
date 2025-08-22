/**
 * Rate Limiter Utility Module
 * Manages cooldowns, rate limits, and spam prevention
 */

const { logger } = require('./logger');

class RateLimiter {
  constructor() {
    this.cooldowns = new Map();
    this.userHistory = new Map();
    this.REPLY_WINDOW_MS = 60 * 1000; // 1 minute
  }

  /**
   * Check if user is rate limited for general bot interactions
   */
  checkRateLimit(userId, maxRepliesPerMinute = 30) {
    const now = Date.now();
    const userHistory = this.userHistory.get(userId) || [];

    // Remove old entries
    const recentReplies = userHistory.filter(timestamp =>
      now - timestamp < this.REPLY_WINDOW_MS
    );

    // Check if under limit
    if (recentReplies.length >= maxRepliesPerMinute) {
      logger.warn(`Rate limit exceeded for user ${userId}`);
      return false;
    }

    // Add current timestamp
    recentReplies.push(now);
    this.userHistory.set(userId, recentReplies);
    return true;
  }

  /**
   * Set a cooldown for a specific action
   */
  setCooldown(userId, action, durationMs) {
    const key = `${action}_${userId}`;
    const expiresAt = Date.now() + durationMs;

    this.cooldowns.set(key, expiresAt);

    logger.debug(`Set cooldown for ${userId}:${action} (${durationMs}ms)`);
  }

  /**
   * Check if user is on cooldown for a specific action
   */
  checkCooldown(userId, action) {
    const key = `${action}_${userId}`;
    const expiresAt = this.cooldowns.get(key);

    if (!expiresAt) return { onCooldown: false };

    const now = Date.now();
    const remaining = expiresAt - now;

    if (remaining <= 0) {
      this.cooldowns.delete(key);
      return { onCooldown: false };
    }

    return {
      onCooldown: true,
      remainingMs: remaining,
      remainingSeconds: Math.ceil(remaining / 1000)
    };
  }

  /**
   * Clear cooldown for a specific action
   */
  clearCooldown(userId, action) {
    const key = `${action}_${userId}`;
    this.cooldowns.delete(key);
    logger.debug(`Cleared cooldown for ${userId}:${action}`);
  }

  /**
   * Get cooldown status for multiple actions
   */
  getCooldownStatus(userId, actions) {
    const status = {};

    actions.forEach(action => {
      status[action] = this.checkCooldown(userId, action);
    });

    return status;
  }

  /**
   * Clean up expired cooldowns (performance optimization)
   */
  cleanupExpiredCooldowns() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, expiresAt] of this.cooldowns.entries()) {
      if (now > expiresAt) {
        this.cooldowns.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cleaned up ${cleaned} expired cooldowns`);
    }

    return cleaned;
  }

  /**
   * Advanced rate limiting with burst allowance
   */
  checkAdvancedRateLimit(userId, action, options = {}) {
    const {
      maxRequests = 5,
      windowMs = 60000,
      burstAllowance = 2
    } = options;

    const key = `${action}_${userId}_advanced`;
    const now = Date.now();

    let history = this.cooldowns.get(key);
    if (!history) {
      history = [];
      this.cooldowns.set(key, history);
    }

    // Remove old entries
    const cutoff = now - windowMs;
    history = history.filter(timestamp => timestamp > cutoff);
    this.cooldowns.set(key, history);

    // Check if under limit
    if (history.length >= maxRequests + burstAllowance) {
      const oldestAllowed = history[history.length - (maxRequests + burstAllowance)];
      const remaining = oldestAllowed + windowMs - now;

      return {
        allowed: false,
        remainingMs: remaining,
        remainingSeconds: Math.ceil(remaining / 1000),
        currentUsage: history.length
      };
    }

    // Add current request
    history.push(now);

    return {
      allowed: true,
      currentUsage: history.length,
      remainingRequests: maxRequests + burstAllowance - history.length
    };
  }

  /**
   * Get comprehensive rate limit statistics
   */
  getStats() {
    const now = Date.now();

    // Count active cooldowns
    let activeCooldowns = 0;
    let expiredCooldowns = 0;

    for (const [key, expiresAt] of this.cooldowns.entries()) {
      if (now > expiresAt) {
        expiredCooldowns++;
      } else {
        activeCooldowns++;
      }
    }

    // Count users with rate limit history
    const usersWithHistory = this.userHistory.size;

    return {
      activeCooldowns,
      expiredCooldowns,
      usersWithHistory,
      totalCooldownEntries: this.cooldowns.size,
      cleanupNeeded: expiredCooldowns > 0
    };
  }

  /**
   * Reset all rate limits for a user (admin function)
   */
  resetUserLimits(userId) {
    // Clear all cooldowns for this user
    for (const key of this.cooldowns.keys()) {
      if (key.includes(`_${userId}`)) {
        this.cooldowns.delete(key);
      }
    }

    // Clear user history
    this.userHistory.delete(userId);

    logger.info(`Reset rate limits for user ${userId}`);
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Auto-cleanup interval
setInterval(() => {
  const cleaned = rateLimiter.cleanupExpiredCooldowns();
  if (cleaned > 10) { // Only log if significant cleanup
    logger.debug(`Auto-cleaned ${cleaned} expired cooldowns`);
  }
}, 60000); // Clean up every minute

module.exports = {
  rateLimiter,
  RateLimiter
};