// Add this to your js/components/Navigation.js file

/**
 * Navigation Component
 * Handles the hamburger menu and navigation interactions
 */
class Navigation {
    constructor() {
        this.hamburgerBtn = document.getElementById('hamburger-btn');
        this.dropdownMenu = document.getElementById('dropdown-menu');
        this.init();
    }
    
    init() {
        if (!this.hamburgerBtn || !this.dropdownMenu) {
            console.warn('Navigation elements not found');
            return;
        }
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Hamburger button click
        this.hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburgerBtn.contains(e.target) && !this.dropdownMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
        
        // Close menu when clicking menu items
        const dropdownItems = this.dropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }
    
    toggleMenu() {
        const isOpen = this.hamburgerBtn.classList.contains('active');
        
        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.hamburgerBtn.classList.add('active');
        this.dropdownMenu.classList.add('show');
        
        // Add aria attributes for accessibility
        this.hamburgerBtn.setAttribute('aria-expanded', 'true');
        this.dropdownMenu.setAttribute('aria-hidden', 'false');
    }
    
    closeMenu() {
        this.hamburgerBtn.classList.remove('active');
        this.dropdownMenu.classList.remove('show');
        
        // Update aria attributes
        this.hamburgerBtn.setAttribute('aria-expanded', 'false');
        this.dropdownMenu.setAttribute('aria-hidden', 'true');
    }
    
    isMenuOpen() {
        return this.hamburgerBtn.classList.contains('active');
    }
}

// Add this to your main.js file - update the setupToolbarButtons method
function updateMainJsNavigation() {
    // Replace the existing setupToolbarButtons method in your main.js with this:
    
    setupToolbarButtons: function() {
        // Initialize navigation component
        this.navigation = new Navigation();
        
        // New estimate button
        const newEstimateBtn = document.getElementById('new-estimate-btn');
        if (newEstimateBtn) {
            newEstimateBtn.addEventListener('click', () => {
                if (confirm('Start a new estimate? This will clear all current data.')) {
                    this.newEstimate();
                }
            });
        }
        
        // Save estimate button
        const saveEstimateBtn = document.getElementById('save-estimate-btn');
        if (saveEstimateBtn) {
            saveEstimateBtn.addEventListener('click', () => {
                this.showSaveModal();
            });
        }
        
        // Load estimate button
        const loadEstimateBtn = document.getElementById('load-estimate-btn');
        if (loadEstimateBtn) {
            loadEstimateBtn.addEventListener('click', () => {
                this.showLoadModal();
            });
        }
        
        // Export buttons
        const exportCsvBtn = document.getElementById('export-csv-btn');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                this.exportEstimate('csv');
            });
        }
        
        const exportJsonBtn = document.getElementById('export-json-btn');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => {
                this.exportEstimate('json');
            });
        }
        
        // Print button
        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
        
        // Calculate button (now in header)
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                // Validate inputs before calculation
                let isValid = true;
                
                // Validate quantity fields
                this.locations.forEach(location => {
                    location.actions.forEach(action => {
                        if (!action.validateQuantity()) {
                            isValid = false;
                        }
                    });
                });
                
                if (isValid) {
                    calculateCost(this.locations);
                    
                    // Scroll to results
                    document.getElementById('result').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    showError('Please correct the highlighted fields before calculating.');
                }
            });
        }
    }
}

// Auto-save status update functionality
class AutoSaveStatus {
    constructor() {
        this.statusElement = document.querySelector('.project-status span');
        this.dotElement = document.querySelector('.status-dot');
        this.lastSaveTime = null;
        this.init();
    }
    
    init() {
        if (!this.statusElement) return;
        
        // Update status every few seconds
        setInterval(() => {
            this.updateStatus();
        }, 5000);
        
        // Listen for form changes to trigger auto-save
        this.setupAutoSave();
    }
    
    setupAutoSave() {
        // Listen for changes in form inputs
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.triggerAutoSave();
            }
        });
    }
    
    triggerAutoSave() {
        // Debounce auto-save to avoid too many saves
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.performAutoSave();
        }, 2000);
        
        this.updateStatus('saving');
    }
    
    performAutoSave() {
        // Get the current estimate data
        if (window.constructionApp && window.constructionApp.getEstimateData) {
            const data = window.constructionApp.getEstimateData();
            
            // Save to localStorage with auto-save key
            if (StorageUtil.save('auto_save_estimate', data)) {
                this.lastSaveTime = new Date();
                this.updateStatus('saved');
            } else {
                this.updateStatus('error');
            }
        }
    }
    
    updateStatus(state = 'idle') {
        if (!this.statusElement) return;
        
        switch (state) {
            case 'saving':
                this.statusElement.textContent = 'Saving...';
                this.dotElement.style.background = '#f59e0b';
                break;
            case 'saved':
                this.statusElement.textContent = 'Auto-saved';
                this.dotElement.style.background = '#22c55e';
                break;
            case 'error':
                this.statusElement.textContent = 'Save failed';
                this.dotElement.style.background = '#ef4444';
                break;
            default:
                if (this.lastSaveTime) {
                    const timeDiff = Date.now() - this.lastSaveTime.getTime();
                    const minutes = Math.floor(timeDiff / 60000);
                    
                    if (minutes < 1) {
                        this.statusElement.textContent = 'Auto-saved';
                    } else {
                        this.statusElement.textContent = `Saved ${minutes}m ago`;
                    }
                } else {
                    this.statusElement.textContent = 'Not saved';
                }
                this.dotElement.style.background = '#22c55e';
        }
    }
}

// Initialize auto-save when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize auto-save after a short delay to ensure other components are ready
    setTimeout(() => {
        new AutoSaveStatus();
    }, 1000);
});