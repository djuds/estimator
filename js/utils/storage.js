/**
 * Storage Utility
 * Handles local storage operations for saving and loading estimates
 */

const StorageUtil = {
    /**
     * Save data to local storage
     * @param {string} key - Storage key
     * @param {any} data - Data to store (will be JSON stringified)
     * @return {boolean} Success status
     */
    save: function(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },
    
    /**
     * Load data from local storage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @return {any} Retrieved data or default value
     */
    load: function(key, defaultValue = null) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) {
                return defaultValue;
            }
            return JSON.parse(serialized);
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    },
    
    /**
     * Remove data from local storage
     * @param {string} key - Storage key
     * @return {boolean} Success status
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    /**
     * Check if key exists in local storage
     * @param {string} key - Storage key
     * @return {boolean} True if key exists
     */
    exists: function(key) {
        return localStorage.getItem(key) !== null;
    },
    
    /**
     * Save current estimate
     * @param {string} name - Estimate name
     * @param {Object} data - Estimate data
     * @return {boolean} Success status
     */
    saveEstimate: function(name, data) {
        // Get existing estimates
        const estimates = this.load(CONFIG.STORAGE.SAVED_ESTIMATES, {});
        
        // Add timestamp
        data.savedAt = new Date().toISOString();
        data.name = name;
        
        // Generate a unique ID if needed
        const id = data.id || `estimate_${Date.now()}`;
        estimates[id] = data;
        
        return this.save(CONFIG.STORAGE.SAVED_ESTIMATES, estimates);
    },
    
    /**
     * Get all saved estimates
     * @return {Object} Object with all estimates
     */
    getAllEstimates: function() {
        return this.load(CONFIG.STORAGE.SAVED_ESTIMATES, {});
    },
    
    /**
     * Get a specific estimate by ID
     * @param {string} id - Estimate ID
     * @return {Object|null} Estimate data or null if not found
     */
    getEstimate: function(id) {
        const estimates = this.load(CONFIG.STORAGE.SAVED_ESTIMATES, {});
        return estimates[id] || null;
    },
    
    /**
     * Delete an estimate
     * @param {string} id - Estimate ID
     * @return {boolean} Success status
     */
    deleteEstimate: function(id) {
        const estimates = this.load(CONFIG.STORAGE.SAVED_ESTIMATES, {});
        if (estimates[id]) {
            delete estimates[id];
            return this.save(CONFIG.STORAGE.SAVED_ESTIMATES, estimates);
        }
        return false;
    }
};

// Ensure CONFIG is loaded before this file