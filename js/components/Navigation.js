/**
 * Navigation Component
 * Handles the hamburger menu and navigation interactions
 */
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

