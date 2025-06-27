/**
 * DOM Helper Utilities
 * Helper functions for DOM manipulation
 */

/**
 * Creates an HTML element with specified attributes
 * @param {string} tagName - The HTML tag name
 * @param {Object} attributes - Key-value pairs of attributes
 * @return {HTMLElement} The created element
 */
function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    return element;
}

/**
 * Formats a currency value
 * @param {number} value - The number to format
 * @param {string} currency - Currency symbol (default: '$')
 * @return {string} Formatted currency string
 */
function formatCurrency(value, currency = '$') {
    return `${currency}${value.toFixed(2)}`;
}

/**
 * Creates a tooltip element
 * @param {string} text - Tooltip text
 * @return {HTMLElement} Tooltip element
 */
function createTooltip(text) {
    const tooltip = createElement('div', {
        className: 'tooltip',
        textContent: text
    });
    
    return tooltip;
}

/**
 * Shows a notification message
 * @param {string} message - Notification message
 * @param {string} type - Message type ('error', 'success', 'info')
 * @param {number} duration - Duration in ms (default: 3000)
 */
function showError(message, type = 'error', duration = 3000) {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = createElement('div', {
            id: 'notification-container'
        });
        document.body.appendChild(notificationContainer);
    }
    
    // Determine class based on type
    let className = 'notification ';
    switch (type) {
        case 'success':
            className += 'notification-success';
            break;
        case 'info':
            className += 'notification-info';
            break;
        case 'error':
        default:
            className += 'notification-error';
            break;
    }
    
    // Create notification
    const notification = createElement('div', {
        className: className,
        textContent: message
    });
    
    notificationContainer.appendChild(notification);
    
    // Add animation class after a brief delay
    setTimeout(() => {
        notification.classList.add('notification-visible');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.classList.remove('notification-visible');
        notification.classList.add('notification-hiding');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove container if empty
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300);
    }, duration);
}

/**
 * Validates a form input
 * @param {HTMLElement} input - The input element
 * @param {Function} validationFn - Validation function returning true if valid
 * @param {string} errorMessage - Error message if invalid
 * @return {boolean} True if valid
 */
function validateInput(input, validationFn, errorMessage) {
    const isValid = validationFn(input.value);
    
    if (!isValid) {
        input.classList.add('invalid');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        errorElement.textContent = errorMessage;
        
        const parent = input.parentElement;
        if (!parent.querySelector('.input-error')) {
            parent.appendChild(errorElement);
        }
    } else {
        input.classList.remove('invalid');
        const errorElement = input.parentElement.querySelector('.input-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    return isValid;
}