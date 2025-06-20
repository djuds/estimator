/**
 * Application Configuration
 * Central place for app settings and constants
 */
const CONFIG = {
    // Application settings
    APP_NAME: 'Construction Cost Estimator',
    VERSION: '1.0.0',
    
    // Default values
    DEFAULTS: {
        CONTINGENCY_PERCENT: 10,
        EQUIPMENT_COSTS: 0,
        PERMIT_FEES: 0,
        OVERHEAD_COSTS: 0
    },
    
    // Currency settings
    CURRENCY: {
        SYMBOL: '$',
        CODE: 'USD',
        DECIMAL_PLACES: 2
    },
    
    // UI settings
    UI: {
        ADD_LOCATION_ON_INIT: true,
        MAX_LOCATIONS: 20,
        MAX_ACTIONS_PER_LOCATION: 30,
        ANIMATION_SPEED: 300 // ms
    },
    
    // Storage keys
    STORAGE: {
        SAVED_ESTIMATES: 'construction_estimator_saved',
        USER_PREFERENCES: 'construction_estimator_prefs'
    }
};

// Make it immutable to prevent accidental changes
Object.freeze(CONFIG);
Object.freeze(CONFIG.DEFAULTS);
Object.freeze(CONFIG.CURRENCY);
Object.freeze(CONFIG.UI);
Object.freeze(CONFIG.STORAGE);
