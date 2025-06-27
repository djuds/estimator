/**
 * Location Class
 * Represents a construction location with multiple actions
 */
class Location {
    constructor(id) {
        this.id = id;
        this.actions = [];
        this.nextActionId = 1;
        this.element = null;
    }
    
    render() {
        const locationsContainer = document.getElementById('locations');
        
        // Create location element
        this.element = createElement('div', {
            id: `location-${this.id}`,
            className: 'location'
        });
        
        // Create location content
        const locationContent = `
            <h3>Location: ${this.id}</h3>
            <label for="locationName-${this.id}">Location Name:</label>
            <input type="text" id="locationName-${this.id}" placeholder="Enter location name">
            <div class="location-buttons">
                <button class="add-button" id="add-action-btn-${this.id}">Add Action</button>
                <button class="remove-button" id="remove-location-btn-${this.id}">Remove Location</button>
            </div>
            <div id="actions-${this.id}" class="location-actions"></div>
        `;
        
        this.element.innerHTML = locationContent;
        locationsContainer.appendChild(this.element);
        
        // Add event listeners
        document.getElementById(`add-action-btn-${this.id}`).addEventListener('click', () => {
            this.addAction();
        });
        
        document.getElementById(`remove-location-btn-${this.id}`).addEventListener('click', () => {
            this.remove();
        });
    }
    
    addAction() {
        const actionId = this.nextActionId++;
        const newAction = new Action(this.id, actionId);
        this.actions.push(newAction);
        newAction.render();
        return newAction;
    }
    
    /**
     * Add an action with a specific ID (used when loading saved estimates)
     * @param {number} actionId - The action ID to use
     * @return {Action} The created action
     */
    addActionWithId(actionId) {
        // Ensure nextActionId is always higher than any existing action ID
        this.nextActionId = Math.max(this.nextActionId, actionId + 1);
        
        const newAction = new Action(this.id, actionId);
        this.actions.push(newAction);
        newAction.render();
        return newAction;
    }
    
    removeAction(actionId) {
        const index = this.actions.findIndex(action => action.id === actionId);
        if (index !== -1) {
            this.actions.splice(index, 1);
        }
    }
    
    /**
     * Load saved data into this location
     * @param {Object} locationData - The saved location data
     */
    loadData(locationData) {
        // Set location name
        const locationNameInput = document.getElementById(`locationName-${this.id}`);
        if (locationNameInput && locationData.name) {
            locationNameInput.value = locationData.name;
        }
        
        // Clear existing actions
        this.actions.forEach(action => {
            if (action.autocomplete) {
                action.autocomplete.destroy();
            }
            if (action.element) {
                action.element.remove();
            }
        });
        this.actions = [];
        this.nextActionId = 1;
        
        // Load actions
        if (locationData.actions && Array.isArray(locationData.actions)) {
            locationData.actions.forEach(actionData => {
                const action = this.addActionWithId(actionData.id || this.nextActionId);
                
                // Use setTimeout to ensure the action is fully rendered before loading data
                setTimeout(() => {
                    action.loadData(actionData);
                }, 0);
            });
        }
    }
    
    remove() {
        // Clean up all action autocompletes
        this.actions.forEach(action => {
            if (action.autocomplete) {
                action.autocomplete.destroy();
            }
        });
        
        // Remove from DOM
        if (this.element) {
            this.element.remove();
        }
        
        // Remove from app's locations array
        window.constructionApp.removeLocation(this.id);
    }
    
    getData() {
        // Get location name
        const name = document.getElementById(`locationName-${this.id}`).value || `Location ${this.id}`;
        
        // Get actions data
        const actionsData = this.actions.map(action => action.getData());
        
        // Calculate total costs
        let totalLaborCost = 0;
        let totalMaterialCost = 0;
        
        actionsData.forEach(action => {
            totalLaborCost += action.laborCost;
            totalMaterialCost += action.materialCost;
        });
        
        const totalCost = totalLaborCost + totalMaterialCost;
        
        return {
            id: this.id,
            name: name,
            totalLaborCost: totalLaborCost,
            totalMaterialCost: totalMaterialCost,
            totalCost: totalCost,
            actions: actionsData
        };
    }
}