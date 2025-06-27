/**
 * Autocomplete Component
 * Provides typeahead functionality for input fields
 */
class Autocomplete {
  constructor(inputElement, options = {}) {
    this.input = inputElement;
    this.options = {
      minChars: 2,
      maxResults: 10,
      debounceTime: 300,
      onSelect: null,
      ...options
    };
    
    // Create dropdown element
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'autocomplete-dropdown';
    this.dropdown.style.display = 'none';
    this.input.parentNode.appendChild(this.dropdown);
    
    // Initialize state
    this.isVisible = false;
    this.selectedIndex = -1;
    this.results = [];
    
    // Add event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Input event with debounce
    let debounceTimer;
    this.input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.handleInput();
      }, this.options.debounceTime);
    });
    
    // Handle keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      if (!this.isVisible) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.navigateDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigateUp();
          break;
        case 'Enter':
          e.preventDefault();
          if (this.selectedIndex >= 0) {
            this.selectResult(this.selectedIndex);
          }
          break;
        case 'Escape':
          this.hideDropdown();
          break;
      }
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }
  
  handleInput() {
    const value = this.input.value.trim();
    
    if (value.length < this.options.minChars) {
      this.hideDropdown();
      return;
    }
    
    this.results = ActionsDatabase.searchActions(value);
    this.renderResults();
    
    if (this.hasResults()) {
      this.showDropdown();
    } else {
      this.hideDropdown();
    }
  }
  
  hasResults() {
    return this.results.length > 0 && 
           this.results.some(category => category.actions.length > 0);
  }
  
  renderResults() {
    this.dropdown.innerHTML = '';
    
    if (!this.hasResults()) return;
    
    // Track overall index for keyboard navigation
    let index = 0;
    
    this.results.forEach(category => {
      // Create category header
      const categoryElement = document.createElement('div');
      categoryElement.className = 'autocomplete-category';
      categoryElement.textContent = category.category;
      this.dropdown.appendChild(categoryElement);
      
      // Create action items
      category.actions.forEach(action => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.dataset.index = index;
        item.dataset.id = action.id;
        
        // Highlight matching text
        const query = this.input.value.trim();
        const highlightedName = action.name.replace(
          new RegExp(query, 'gi'),
          match => `<strong>${match}</strong>`
        );
        
        item.innerHTML = highlightedName;
        
        item.addEventListener('click', () => {
          this.selectResult(index);
        });
        
        this.dropdown.appendChild(item);
        index++;
      });
    });
  }
  
  showDropdown() {
    // Position dropdown below input
    const inputRect = this.input.getBoundingClientRect();
    this.dropdown.style.width = `${inputRect.width}px`;
    this.dropdown.style.top = `${inputRect.bottom}px`;
    this.dropdown.style.left = `${inputRect.left}px`;
    
    this.dropdown.style.display = 'block';
    this.isVisible = true;
    this.selectedIndex = -1;
  }
  
  hideDropdown() {
    this.dropdown.style.display = 'none';
    this.isVisible = false;
    this.selectedIndex = -1;
  }
  
  navigateDown() {
    // Count total results
    let totalItems = this.countTotalItems();
    
    if (totalItems === 0) return;
    
    this.selectedIndex = (this.selectedIndex + 1) % totalItems;
    this.highlightResult();
  }
  
  navigateUp() {
    // Count total results
    let totalItems = this.countTotalItems();
    
    if (totalItems === 0) return;
    
    this.selectedIndex = this.selectedIndex <= 0 ? 
      totalItems - 1 : this.selectedIndex - 1;
    this.highlightResult();
  }
  
  countTotalItems() {
    let count = 0;
    this.results.forEach(category => {
      count += category.actions.length;
    });
    return count;
  }
  
  highlightResult() {
    // Remove existing highlight
    const items = this.dropdown.querySelectorAll('.autocomplete-item');
    items.forEach(item => {
      item.classList.remove('selected');
    });
    
    // Add highlight to selected item
    if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
      const selectedItem = items[this.selectedIndex];
      selectedItem.classList.add('selected');
      
      // Ensure item is visible within dropdown
      selectedItem.scrollIntoView({ block: 'nearest' });
    }
  }
  
  selectResult(index) {
    const items = this.dropdown.querySelectorAll('.autocomplete-item');
    if (index >= 0 && index < items.length) {
      const selectedItem = items[index];
      const actionId = selectedItem.dataset.id;
      const action = ActionsDatabase.getActionById(actionId);
      
      if (action) {
        // Set the input value with the selected action's name
        this.input.value = action.name;
        
        // Force input to update its value
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Trigger change event to notify any listeners
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Call the onSelect callback if provided
        if (typeof this.options.onSelect === 'function') {
          this.options.onSelect(action);
        }
      }
    }
    
    this.hideDropdown();
  }
  
  destroy() {
    // Remove dropdown element
    if (this.dropdown && this.dropdown.parentNode) {
      this.dropdown.parentNode.removeChild(this.dropdown);
    }
    
    // Remove event listeners (if needed)
  }
}