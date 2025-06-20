/**
 * Validation Utility
 * Functions for validating form inputs
 */

const ValidationUtil = {
    /**
     * Validate a number input
     * @param {string} value - Input value
     * @param {number} min - Minimum value (optional)
     * @param {number} max - Maximum value (optional)
     * @return {boolean} True if valid
     */
    isValidNumber: function(value, min = null, max = null) {
        const number = parseFloat(value);
        
        if (isNaN(number)) {
            return false;
        }
        
        if (min !== null && number < min) {
            return false;
        }
        
        if (max !== null && number > max) {
            return false;
        }
        
        return true;
    },
    
    /**
     * Validate text input
     * @param {string} value - Input value
     * @param {number} minLength - Minimum length (optional)
     * @param {number} maxLength - Maximum length (optional)
     * @return {boolean} True if valid
     */
    isValidText: function(value, minLength = 0, maxLength = null) {
        if (typeof value !== 'string') {
            return false;
        }
        
        if (value.length < minLength) {
            return false;
        }
        
        if (maxLength !== null && value.length > maxLength) {
            return false;
        }
        
        return true;
    },
    
    /**
     * Validate a form
     * @param {HTMLFormElement} form - The form element
     * @return {boolean} True if all inputs are valid
     */
    validateForm: function(form) {
        let isValid = true;
        
        // Get all inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Skip disabled inputs
            if (input.disabled) {
                return;
            }
            
            // Validate based on type
            switch (input.type) {
                case 'number':
                    const min = input.hasAttribute('min') ? parseFloat(input.min) : null;
                    const max = input.hasAttribute('max') ? parseFloat(input.max) : null;
                    
                    if (!this.isValidNumber(input.value, min, max)) {
                        this.markInvalid(input, 'Please enter a valid number');
                        isValid = false;
                    } else {
                        this.markValid(input);
                    }
                    break;
                    
                case 'text':
                case 'textarea':
                    const minLength = input.hasAttribute('minlength') ? parseInt(input.minlength) : 0;
                    const maxLength = input.hasAttribute('maxlength') ? parseInt(input.maxlength) : null;
                    
                    if (!this.isValidText(input.value, minLength, maxLength)) {
                        this.markInvalid(input, `Text must be between ${minLength} and ${maxLength || 'unlimited'} characters`);
                        isValid = false;
                    } else {
                        this.markValid(input);
                    }
                    break;
                    
                // Add more types as needed
            }
            
            // Check for required fields
            if (input.required && !input.value.trim()) {
                this.markInvalid(input, 'This field is required');
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    /**
     * Mark an input as invalid
     * @param {HTMLElement} input - The input element
     * @param {string} message - Error message
     */
    markInvalid: function(input, message) {
        input.classList.add('invalid');
        
        // Add error message if not already present
        const parent = input.parentElement;
        let errorElement = parent.querySelector('.input-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'input-error';
            parent.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    },
    
    /**
     * Mark an input as valid
     * @param {HTMLElement} input - The input element
     */
    markValid: function(input) {
        input.classList.remove('invalid');
        
        // Remove error message if present
        const parent = input.parentElement;
        const errorElement = parent.querySelector('.input-error');
        
        if (errorElement) {
            errorElement.remove();
        }
    },
    
    /**
     * Initialize validation styles
     * Called once on application load
     */
    initValidationStyles: function() {
        const validationStyles = document.createElement('style');
        validationStyles.textContent = `
            .invalid {
                border-color: #dc3545 !important;
                background-color: rgba(220, 53, 69, 0.1) !important;
            }
            
            .input-error {
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: -10px;
                margin-bottom: 10px;
            }
        `;
        document.head.appendChild(validationStyles);
    }
};

// Initialize validation styles
ValidationUtil.initValidationStyles();
