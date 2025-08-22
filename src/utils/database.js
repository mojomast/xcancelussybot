/**
 * Database Utility Module
 * Handles all JSON file operations and data persistence
 */

const fs = require('fs').promises;
const path = require('path');
const { logger } = require('./logger');

class Database {
  constructor() {
    this.cache = new Map();
    this.dirtyFiles = new Set();
    this.autoSaveInterval = null;
  }

  /**
   * Initialize the database system
   */
  async initialize() {
    // Start auto-save interval
    this.autoSaveInterval = setInterval(() => {
      this.saveDirtyFiles();
    }, 30000); // Save every 30 seconds

    logger.info('Database system initialized');
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    await this.saveDirtyFiles();
    logger.info('Database system cleaned up');
  }

  /**
   * Load data from JSON file with caching
   */
  async load(filePath, defaultData = {}) {
    try {
      // Check cache first
      if (this.cache.has(filePath)) {
        return this.cache.get(filePath);
      }

      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Read and parse file
      const data = await fs.readFile(filePath, 'utf8');
      const parsedData = JSON.parse(data);

      // Cache the data
      this.cache.set(filePath, parsedData);

      logger.debug(`Loaded data from ${filePath}`);
      return parsedData;

    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create with default data
        const defaultDataStr = JSON.stringify(defaultData, null, 2);
        await fs.writeFile(filePath, defaultDataStr);
        this.cache.set(filePath, defaultData);

        logger.debug(`Created new data file ${filePath} with defaults`);
        return defaultData;
      }

      logger.error(`Failed to load data from ${filePath}:`, error);
      return defaultData;
    }
  }

  /**
   * Save data to JSON file
   */
  async save(filePath, data) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonData);

      // Update cache
      this.cache.set(filePath, data);

      // Remove from dirty files
      this.dirtyFiles.delete(filePath);

      logger.debug(`Saved data to ${filePath}`);

    } catch (error) {
      logger.error(`Failed to save data to ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Mark file as dirty (needs saving)
   */
  markDirty(filePath) {
    this.dirtyFiles.add(filePath);
  }

  /**
   * Save all dirty files
   */
  async saveDirtyFiles() {
    if (this.dirtyFiles.size === 0) return;

    const files = Array.from(this.dirtyFiles);
    this.dirtyFiles.clear();

    for (const filePath of files) {
      try {
        const data = this.cache.get(filePath);
        if (data) {
          await this.save(filePath, data);
        }
      } catch (error) {
        logger.error(`Failed to auto-save ${filePath}:`, error);
      }
    }

    if (files.length > 0) {
      logger.debug(`Auto-saved ${files.length} files`);
    }
  }

  /**
   * Get data from cache without loading from file
   */
  getCached(filePath) {
    return this.cache.get(filePath);
  }

  /**
   * Update data in cache and mark as dirty
   */
  update(filePath, updater) {
    const currentData = this.cache.get(filePath);
    if (!currentData) {
      throw new Error(`No cached data for ${filePath}`);
    }

    const newData = typeof updater === 'function' ? updater(currentData) : updater;
    this.cache.set(filePath, newData);
    this.markDirty(filePath);

    return newData;
  }

  /**
   * Atomic update with retry logic
   */
  async atomicUpdate(filePath, updater, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const currentData = await this.load(filePath);
        const newData = typeof updater === 'function' ? updater(currentData) : updater;
        await this.save(filePath, newData);
        return newData;
      } catch (error) {
        logger.warn(`Atomic update attempt ${attempt} failed for ${filePath}:`, error);
        if (attempt === maxRetries) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
      }
    }
  }

  /**
   * Backup a file
   */
  async backup(filePath) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${filePath}.backup.${timestamp}`;

      const data = await fs.readFile(filePath, 'utf8');
      await fs.writeFile(backupPath, data);

      logger.debug(`Created backup: ${backupPath}`);
      return backupPath;

    } catch (error) {
      logger.error(`Failed to create backup for ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get statistics about cached data
   */
  getStats() {
    return {
      cachedFiles: this.cache.size,
      dirtyFiles: this.dirtyFiles.size,
      cacheSize: JSON.stringify([...this.cache.values()]).length
    };
  }
}

// Singleton instance
const database = new Database();

module.exports = {
  database,
  Database
};