/**
 * Permissions Utility Module
 * Handles Discord permission checks and role validation
 */

const { logger } = require('./logger');

// Permission flags for common checks
const PERMISSIONS = {
  ADMINISTRATOR: 'Administrator',
  MANAGE_GUILD: 'ManageGuild',
  MANAGE_MESSAGES: 'ManageMessages',
  KICK_MEMBERS: 'KickMembers',
  BAN_MEMBERS: 'BanMembers',
  MUTE_MEMBERS: 'MuteMembers',
  MOVE_MEMBERS: 'MoveMembers',
  MANAGE_ROLES: 'ManageRoles',
  MANAGE_CHANNELS: 'ManageChannels',
  MANAGE_WEBHOOKS: 'ManageWebhooks'
};

// Feature-specific permission requirements
const FEATURE_PERMISSIONS = {
  // Admin-only features
  admin_commands: [PERMISSIONS.ADMINISTRATOR],
  macro_management: [PERMISSIONS.ADMINISTRATOR],
  rpg_channel_control: [PERMISSIONS.ADMINISTRATOR],
  request_approval: [PERMISSIONS.ADMINISTRATOR],

  // User features (no special permissions needed)
  use_macros: [],
  play_rpg: [],
  submit_requests: [],
  view_requests: []
};

class PermissionManager {
  constructor() {
    this.roleCache = new Map();
    this.permissionCache = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Check if member has administrator permissions
   */
  isAdministrator(member) {
    return member.permissions.has('Administrator');
  }

  /**
   * Check if member has specific permissions
   */
  hasPermissions(member, requiredPermissions) {
    if (this.isAdministrator(member)) return true;

    return requiredPermissions.every(permission =>
      member.permissions.has(permission)
    );
  }

  /**
   * Check if member can use a specific feature
   */
  canUseFeature(member, feature) {
    const requiredPermissions = FEATURE_PERMISSIONS[feature];
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No special permissions required
    }

    return this.hasPermissions(member, requiredPermissions);
  }

  /**
   * Get all features a member can use
   */
  getAvailableFeatures(member) {
    const features = [];

    for (const [feature, permissions] of Object.entries(FEATURE_PERMISSIONS)) {
      if (this.canUseFeature(member, feature)) {
        features.push(feature);
      }
    }

    return features;
  }

  /**
   * Check if member has any of the specified roles
   */
  hasAnyRole(member, roleNames) {
    return member.roles.cache.some(role =>
      roleNames.includes(role.name.toLowerCase())
    );
  }

  /**
   * Check if member has all of the specified roles
   */
  hasAllRoles(member, roleNames) {
    return roleNames.every(roleName =>
      member.roles.cache.some(role =>
        role.name.toLowerCase() === roleName.toLowerCase()
      )
    );
  }

  /**
   * Get member's highest role position
   */
  getHighestRolePosition(member) {
    return Math.max(...member.roles.cache.map(role => role.position));
  }

  /**
   * Check if member can manage another member
   */
  canManageMember(manager, target) {
    if (this.isAdministrator(manager)) return true;
    if (this.isAdministrator(target)) return false;

    const managerHighest = this.getHighestRolePosition(manager);
    const targetHighest = this.getHighestRolePosition(target);

    return managerHighest > targetHighest;
  }

  /**
   * Get permission error message
   */
  getPermissionErrorMessage(feature) {
    const permissions = FEATURE_PERMISSIONS[feature];
    if (!permissions || permissions.length === 0) {
      return 'This feature is not available.';
    }

    if (permissions.includes(PERMISSIONS.ADMINISTRATOR)) {
      return 'This feature requires administrator permissions.';
    }

    return `This feature requires the following permissions: ${permissions.join(', ')}`;
  }

  /**
   * Cache member permissions for performance
   */
  cacheMemberPermissions(member) {
    const key = `${member.guild.id}_${member.id}`;
    const features = this.getAvailableFeatures(member);

    this.permissionCache.set(key, {
      features,
      timestamp: Date.now()
    });

    // Auto-cleanup after cache duration
    setTimeout(() => {
      this.permissionCache.delete(key);
    }, this.CACHE_DURATION);

    return features;
  }

  /**
   * Get cached permissions
   */
  getCachedPermissions(member) {
    const key = `${member.guild.id}_${member.id}`;
    const cached = this.permissionCache.get(key);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.features;
    }

    return this.cacheMemberPermissions(member);
  }

  /**
   * Clear permission cache for a member
   */
  clearMemberCache(member) {
    const key = `${member.guild.id}_${member.id}`;
    this.permissionCache.delete(key);
  }

  /**
   * Get comprehensive permission report
   */
  getPermissionReport(member) {
    const features = this.getAvailableFeatures(member);
    const highestRole = member.roles.cache.reduce((highest, role) =>
      role.position > highest.position ? role : highest
    );

    return {
      userId: member.id,
      username: member.user.username,
      isAdmin: this.isAdministrator(member),
      highestRole: {
        name: highestRole.name,
        position: highestRole.position,
        color: highestRole.hexColor
      },
      availableFeatures: features,
      allPermissions: member.permissions.toArray(),
      roleCount: member.roles.cache.size
    };
  }

  /**
   * Validate permission requirements for custom commands
   */
  validateCustomCommand(member, commandConfig) {
    const {
      requiredPermissions = [],
      requiredRoles = [],
      allowAdminBypass = true
    } = commandConfig;

    // Admin bypass
    if (allowAdminBypass && this.isAdministrator(member)) {
      return { allowed: true };
    }

    // Check permissions
    if (requiredPermissions.length > 0 && !this.hasPermissions(member, requiredPermissions)) {
      return {
        allowed: false,
        reason: `Missing permissions: ${requiredPermissions.join(', ')}`
      };
    }

    // Check roles
    if (requiredRoles.length > 0 && !this.hasAnyRole(member, requiredRoles)) {
      return {
        allowed: false,
        reason: `Missing required roles: ${requiredRoles.join(', ')}`
      };
    }

    return { allowed: true };
  }
}

// Global permission manager instance
const permissionManager = new PermissionManager();

// Helper functions for common checks
const permissions = {
  isAdmin: (member) => permissionManager.isAdministrator(member),
  canUseFeature: (member, feature) => permissionManager.canUseFeature(member, feature),
  hasPermissions: (member, permissions) => permissionManager.hasPermissions(member, permissions),
  hasAnyRole: (member, roles) => permissionManager.hasAnyRole(member, roles),
  hasAllRoles: (member, roles) => permissionManager.hasAllRoles(member, roles),
  canManageMember: (manager, target) => permissionManager.canManageMember(manager, target),
  getPermissionError: (feature) => permissionManager.getPermissionErrorMessage(feature),
  getAvailableFeatures: (member) => permissionManager.getAvailableFeatures(member),
  getPermissionReport: (member) => permissionManager.getPermissionReport(member)
};

module.exports = {
  permissionManager,
  PermissionManager,
  permissions,
  PERMISSIONS,
  FEATURE_PERMISSIONS
};