/**
 * Action Class
 * Represents a construction action within a location
 */
class Action {
    constructor(locationId, actionId) {
        this.locationId = locationId;
        this.id = actionId;
        this.element = null;
        this.autocomplete = null;
        this.selectedActionId = null;
        this.materialsExpanded = false;
        this.materials = [];
        this.subtasks = [];
        this.totalMaterialCost = 0;
    }
    
    render() {
        const actionsContainer = document.getElementById(`actions-${this.locationId}`);
        
        // Create action element
        this.element = createElement('div', {
            id: `action-${this.locationId}-${this.id}`,
            className: 'action'
        });
        
        // Create action content
        const actionContent = `
            <div class="action-header">
                <h4>Action ${this.id}</h4>
                <button class="remove-button" id="remove-action-btn-${this.locationId}-${this.id}">
                    Remove Action
                </button>
            </div>
            
            <div class="action-content">
                <div class="form-group has-autocomplete">
                    <label for="actionName-${this.locationId}-${this.id}">Action:</label>
                    <input type="text" id="actionName-${this.locationId}-${this.id}" placeholder="Start typing to search actions...">
                </div>
                
                <div class="form-group">
                    <label for="description-${this.locationId}-${this.id}">Description:</label>
                    <textarea id="description-${this.locationId}-${this.id}" rows="2" placeholder="Optional description..."></textarea>
                </div>
            </div>
            
            <div class="action-details">
                <div class="form-group">
                    <label for="quantity-${this.locationId}-${this.id}">Quantity:</label>
                    <input type="number" id="quantity-${this.locationId}-${this.id}" value="1" min="0.01" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="unit-${this.locationId}-${this.id}">Unit:</label>
                    <select id="unit-${this.locationId}-${this.id}">
                        <option value="Count">Count</option>
                        <option value="Feet">Feet</option>
                        <option value="Sq. Ft">Sq. Ft</option>
                        <option value="Cubic Feet">Cubic Feet</option>
                        <option value="Meters">Meters</option>
                        <option value="Sq. M">Sq. M</option>
                        <option value="Yards">Yards</option>
                        <option value="Cubic Yards">Cubic Yards</option>
                        <option value="Board Feet">Board Feet</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="unitPrice-${this.locationId}-${this.id}">Labor Cost ($):</label>
                    <input type="number" id="unitPrice-${this.locationId}-${this.id}" value="0" min="0" step="0.01">
                </div>
                
                <div class="form-group total-price">
                    <label for="totalPrice-${this.locationId}-${this.id}">Total Price:</label>
                    <div class="price-display" id="totalPrice-${this.locationId}-${this.id}">$0.00</div>
                </div>
            </div>
            
            <div class="materials-section" id="materials-section-${this.locationId}-${this.id}">
                <div class="materials-header">
                    <button type="button" class="materials-toggle" id="materials-toggle-${this.locationId}-${this.id}">
                        <span class="toggle-icon">▶</span> Show Materials & Subtasks
                    </button>
                    <div class="materials-cost" id="materials-cost-${this.locationId}-${this.id}">$0.00</div>
                </div>
                <div class="materials-content" id="materials-content-${this.locationId}-${this.id}" style="display: none;">
                    <!-- Materials and subtasks will be rendered here -->
                </div>
            </div>
        `;
        
        this.element.innerHTML = actionContent;
        actionsContainer.appendChild(this.element);
        
        // Initialize autocomplete
        this.initializeAutocomplete();
        
        // Add event listeners for calculations and validation
        this.addEventListeners();
    }
    
    initializeAutocomplete() {
        const actionNameInput = document.getElementById(`actionName-${this.locationId}-${this.id}`);
        const unitSelect = document.getElementById(`unit-${this.locationId}-${this.id}`);
        
        this.autocomplete = new Autocomplete(actionNameInput, {
            onSelect: (action) => {
                // Store the selected action ID for materials calculation
                this.selectedActionId = action.id;
                
                // When an action is selected, set the default unit
                if (action.defaultUnit) {
                    unitSelect.value = action.defaultUnit;
                }
                
                // Calculate materials and subtasks
                this.calculateMaterialsAndSubtasks();
                
                // Trigger calculation update
                this.updateTotalPrice();
            }
        });
    }
    
    addEventListeners() {
        // Add event listener for remove button
        document.getElementById(`remove-action-btn-${this.locationId}-${this.id}`).addEventListener('click', () => {
            this.remove();
        });
        
        // Add event listeners for calculation updates
        const quantityInput = document.getElementById(`quantity-${this.locationId}-${this.id}`);
        const unitPriceInput = document.getElementById(`unitPrice-${this.locationId}-${this.id}`);
        
        quantityInput.addEventListener('input', () => {
            this.validateQuantity();
            this.calculateMaterialsAndSubtasks();
            this.updateTotalPrice();
        });
        
        unitPriceInput.addEventListener('input', () => {
            this.updateTotalPrice();
        });
        
        // Add toggle event for materials section
        const materialsToggle = document.getElementById(`materials-toggle-${this.locationId}-${this.id}`);
        materialsToggle.addEventListener('click', () => {
            this.toggleMaterials();
        });
        
        // Initial calculation
        this.updateTotalPrice();
    }
    
    validateQuantity() {
        const quantityInput = document.getElementById(`quantity-${this.locationId}-${this.id}`);
        const quantity = parseFloat(quantityInput.value);
        
        if (isNaN(quantity) || quantity <= 0) {
            quantityInput.classList.add('invalid');
            return false;
        } else {
            quantityInput.classList.remove('invalid');
            return true;
        }
    }
    
    calculateMaterialsAndSubtasks() {
        if (!this.selectedActionId) {
            return;
        }
        
        const quantityInput = document.getElementById(`quantity-${this.locationId}-${this.id}`);
        const quantity = parseFloat(quantityInput.value) || 0;
        
        // Call the database function to calculate materials and subtasks
        const result = ActionsDatabase.calculateMaterialsAndSubtasks(this.selectedActionId, quantity);
        
        this.materials = result.materials;
        this.subtasks = result.subtasks;
        this.totalMaterialCost = result.totalMaterialCost;
        
        // Update the materials cost display
        this.updateMaterialsCost();
        
        // Render materials and subtasks if expanded
        if (this.materialsExpanded) {
            this.renderMaterialsAndSubtasks();
        }
    }
    
    updateMaterialsCost() {
        const materialsCostDisplay = document.getElementById(`materials-cost-${this.locationId}-${this.id}`);
        materialsCostDisplay.textContent = formatCurrency(this.totalMaterialCost);
    }
    
    toggleMaterials() {
        const materialsContent = document.getElementById(`materials-content-${this.locationId}-${this.id}`);
        const toggleIcon = document.querySelector(`#materials-toggle-${this.locationId}-${this.id} .toggle-icon`);
        const toggleButton = document.getElementById(`materials-toggle-${this.locationId}-${this.id}`);
        
        this.materialsExpanded = !this.materialsExpanded;
        
        if (this.materialsExpanded) {
            materialsContent.style.display = 'block';
            toggleIcon.textContent = '▼';
            toggleButton.innerHTML = `<span class="toggle-icon">▼</span> Hide Materials & Subtasks`;
            this.renderMaterialsAndSubtasks();
        } else {
            materialsContent.style.display = 'none';
            toggleIcon.textContent = '▶';
            toggleButton.innerHTML = `<span class="toggle-icon">▶</span> Show Materials & Subtasks`;
        }
    }
    
    renderMaterialsAndSubtasks() {
        const materialsContent = document.getElementById(`materials-content-${this.locationId}-${this.id}`);
        let html = '';
        
        // Check if there are any materials or subtasks
        if (this.materials.length === 0 && this.subtasks.length === 0) {
            html = '<p>No materials or subtasks available for this action.</p>';
            materialsContent.innerHTML = html;
            return;
        }
        
        // Render materials
        if (this.materials.length > 0) {
            html += `
                <div class="materials-group">
                    <h5>Materials</h5>
                    <table class="materials-table">
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Cost Per Unit</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            this.materials.forEach(material => {
                html += `
                    <tr>
                        <td>${material.name}</td>
                        <td>${material.quantity.toFixed(2)}</td>
                        <td>${material.unit}</td>
                        <td>${formatCurrency(material.costPerUnit)}</td>
                        <td>${formatCurrency(material.totalCost)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Render subtasks
        if (this.subtasks.length > 0) {
            html += `
                <div class="subtasks-group">
                    <h5>Subtasks</h5>
                    <table class="subtasks-table">
                        <thead>
                            <tr>
                                <th>Subtask</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Cost Per Unit</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            this.subtasks.forEach(subtask => {
                html += `
                    <tr>
                        <td>${subtask.name}</td>
                        <td>${subtask.quantity.toFixed(2)}</td>
                        <td>${subtask.unit}</td>
                        <td>${formatCurrency(subtask.costPerUnit)}</td>
                        <td>${formatCurrency(subtask.totalCost)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Show total materials cost
        html += `
            <div class="materials-summary">
                <strong>Total Materials & Subtasks Cost:</strong> ${formatCurrency(this.totalMaterialCost)}
            </div>
        `;
        
        materialsContent.innerHTML = html;
    }
    
    updateTotalPrice() {
        const quantityInput = document.getElementById(`quantity-${this.locationId}-${this.id}`);
        const unitPriceInput = document.getElementById(`unitPrice-${this.locationId}-${this.id}`);
        const totalPriceDisplay = document.getElementById(`totalPrice-${this.locationId}-${this.id}`);
        
        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        
        const laborCost = quantity * unitPrice;
        const totalPrice = laborCost + this.totalMaterialCost;
        
        totalPriceDisplay.textContent = formatCurrency(totalPrice);
    }
    
    remove() {
        // Clean up autocomplete if it exists
        if (this.autocomplete) {
            this.autocomplete.destroy();
        }
        
        // Remove from DOM
        if (this.element) {
            this.element.remove();
        }
        
        // Find the parent location and remove this action from its actions array
        const location = window.constructionApp.locations.find(loc => loc.id === this.locationId);
        if (location) {
            location.removeAction(this.id);
        }
    }
    
    getData() {
        // Get action data from form
        const name = document.getElementById(`actionName-${this.locationId}-${this.id}`).value || `Action ${this.id}`;
        const description = document.getElementById(`description-${this.locationId}-${this.id}`).value || '';
        const quantity = parseFloat(document.getElementById(`quantity-${this.locationId}-${this.id}`).value) || 0;
        const unit = document.getElementById(`unit-${this.locationId}-${this.id}`).value || 'Count';
        const unitPrice = parseFloat(document.getElementById(`unitPrice-${this.locationId}-${this.id}`).value) || 0;
        
        // Calculate costs
        const laborCost = quantity * unitPrice;
        const materialCost = this.totalMaterialCost;
        const totalPrice = laborCost + materialCost;
        
        return {
            id: this.id,
            actionId: this.selectedActionId,
            name: name,
            description: description,
            quantity: quantity,
            unit: unit,
            unitPrice: unitPrice,
            laborCost: laborCost,
            materialCost: materialCost,
            totalPrice: totalPrice,
            materials: this.materials,
            subtasks: this.subtasks
        };
    }
}
