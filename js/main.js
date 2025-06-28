/**
 * Construction Cost Estimator - Main Application
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    const app = {
        locations: [],
        nextLocationId: 1,
        
        init: function() {
            // Set current date for project date field
            if (document.getElementById('project-date')) {
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('project-date').value = today;
            }
            
            // Set up event listeners
            document.getElementById('add-location-btn').addEventListener('click', () => {
                this.addLocation();
            });
            


            
            // Set up toolbar button listeners
            this.setupToolbarButtons();
        },
        
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
    
    // Calculate button (now in header) - THIS IS THE NEW ADDITION
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
},
        
        addLocation: function() {
            const locationId = this.nextLocationId++;
            const newLocation = new Location(locationId);
            this.locations.push(newLocation);
            newLocation.render();
            
            // Add first action automatically
            setTimeout(() => {
                newLocation.addAction();
            }, 100);
            
            return newLocation; // Return the location for use in loading
        },
        
        removeLocation: function(locationId) {
            const index = this.locations.findIndex(loc => loc.id === locationId);
            if (index !== -1) {
                this.locations.splice(index, 1);
            }
        },
        
        newEstimate: function() {
            // Clear all locations
            this.locations.forEach(location => {
                if (location.element) {
                    location.element.remove();
                }
            });
            
            // Reset state
            this.locations = [];
            this.nextLocationId = 1;
            
            // Clear input fields
            document.getElementById('project-name').value = '';
            document.getElementById('project-client').value = '';
            document.getElementById('permitFees').value = '0';
            document.getElementById('equipmentCosts').value = '0';
            document.getElementById('overheadCosts').value = '0';
            document.getElementById('contingencyPercent').value = '10';
            
            // Clear results
            document.getElementById('result').innerHTML = '';
            
            // Add first location
            this.addLocation();
        },
        
        showSaveModal: function() {
            // Set default name based on project name if available
            const projectName = document.getElementById('project-name').value;
            if (projectName) {
                document.getElementById('save-name').value = projectName;
            } else {
                document.getElementById('save-name').value = `Estimate ${new Date().toLocaleString()}`;
            }
            
            // Show modal
            document.getElementById('save-modal').style.display = 'block';
            
            // Handle save button
            document.getElementById('confirm-save-btn').onclick = () => {
                const estimateName = document.getElementById('save-name').value;
                if (estimateName) {
                    this.saveEstimate(estimateName);
                    document.getElementById('save-modal').style.display = 'none';
                }
            };
            
            // Handle close button
            const closeButtons = document.querySelectorAll('#save-modal .close-modal');
            closeButtons.forEach(button => {
                button.onclick = () => {
                    document.getElementById('save-modal').style.display = 'none';
                };
            });
        },
        
        saveEstimate: function(name) {
            // Prepare data
            const data = this.getEstimateData();
            
            // Save to local storage
            if (StorageUtil.saveEstimate(name, data)) {
                showError(`Estimate "${name}" saved successfully.`, 'success');
            } else {
                showError('Failed to save estimate. Please try again.', 'error');
            }
        },
        
        showLoadModal: function() {
            const savedEstimatesList = document.getElementById('saved-estimates-list');
            const estimates = StorageUtil.getAllEstimates();
            
            // Clear previous list
            savedEstimatesList.innerHTML = '';
            
            // Check if there are any saved estimates
            if (Object.keys(estimates).length === 0) {
                savedEstimatesList.innerHTML = '<p>No saved estimates found.</p>';
                document.getElementById('load-modal').style.display = 'block';
                return;
            }
            
            // Create list of saved estimates
            for (const id in estimates) {
                const estimate = estimates[id];
                const item = document.createElement('div');
                item.className = 'saved-estimate-item';
                
                const date = new Date(estimate.savedAt);
                const formattedDate = date.toLocaleString();
                
                item.innerHTML = `
                    <div class="estimate-info">
                        <h4>${estimate.name}</h4>
                        <p>Saved: ${formattedDate}</p>
                        <p>Total: ${formatCurrency(estimate.grandTotal)}</p>
                    </div>
                    <div class="estimate-actions">
                        <button class="load-estimate-btn" data-id="${id}">Load</button>
                        <button class="delete-estimate-btn" data-id="${id}">Delete</button>
                    </div>
                `;
                
                savedEstimatesList.appendChild(item);
            }
            
            // Add event listeners to buttons
            document.querySelectorAll('.load-estimate-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    this.loadEstimate(id);
                    document.getElementById('load-modal').style.display = 'none';
                });
            });
            
            document.querySelectorAll('.delete-estimate-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Delete this estimate?')) {
                        StorageUtil.deleteEstimate(id);
                        e.target.closest('.saved-estimate-item').remove();
                        
                        // Check if list is now empty
                        if (savedEstimatesList.children.length === 0) {
                            savedEstimatesList.innerHTML = '<p>No saved estimates found.</p>';
                        }
                    }
                });
            });
            
            // Show modal
            document.getElementById('load-modal').style.display = 'block';
            
            // Handle close button
            const closeButtons = document.querySelectorAll('#load-modal .close-modal');
            closeButtons.forEach(button => {
                button.onclick = () => {
                    document.getElementById('load-modal').style.display = 'none';
                };
            });
        },
        
        loadEstimate: function(id) {
            const estimate = StorageUtil.getEstimate(id);
            if (!estimate) {
                showError('Failed to load estimate. It may have been deleted.', 'error');
                return;
            }
            
            // Start fresh
            this.newEstimate();
            
            // Load project info
            if (estimate.projectName) {
                document.getElementById('project-name').value = estimate.projectName;
            }
            
            if (estimate.projectDate) {
                document.getElementById('project-date').value = estimate.projectDate;
            }
            
            if (estimate.projectClient) {
                document.getElementById('project-client').value = estimate.projectClient;
            }
            
            // Load global costs
            document.getElementById('permitFees').value = estimate.permitFees || 0;
            document.getElementById('equipmentCosts').value = estimate.equipmentCosts || 0;
            document.getElementById('overheadCosts').value = estimate.overheadCosts || 0;
            document.getElementById('contingencyPercent').value = estimate.contingencyPercent || 10;
            
            // Remove the default first location that was created by newEstimate()
            if (this.locations.length > 0) {
                this.locations[0].remove();
                this.locations = [];
                this.nextLocationId = 1;
            }
            
            // Load locations and actions
            if (estimate.locations && estimate.locations.length > 0) {
                estimate.locations.forEach(locationData => {
                    // Create location
                    const location = new Location(this.nextLocationId++);
                    this.locations.push(location);
                    location.render();
                    
                    // Set location name
                    setTimeout(() => {
                        document.getElementById(`locationName-${location.id}`).value = locationData.name;
                        
                        // Create actions
                        if (locationData.actions && locationData.actions.length > 0) {
                            locationData.actions.forEach(actionData => {
                                const action = new Action(location.id, location.nextActionId++);
                                location.actions.push(action);
                                action.render();
                                
                                // Use setTimeout to ensure DOM elements are ready before loading data
                                setTimeout(() => {
                                    action.loadData(actionData);
                                }, 50);
                            });
                        }
                    }, 50);
                });
            }
            
            // Calculate and show results after a short delay to ensure all data is loaded
            setTimeout(() => {
                calculateCost(this.locations);
            }, 200);
            
            showError(`Estimate "${estimate.name}" loaded successfully.`, 'success');
        },
        
        exportEstimate: function(format) {
            // Check if there are any locations
            if (this.locations.length === 0) {
                showError('No data to export. Please add at least one location and action.', 'error');
                return;
            }
            
            // Get project name for filename
            let filename = document.getElementById('project-name').value || 'construction-estimate';
            // Remove special characters from filename
            filename = filename.replace(/[^a-z0-9]/gi, '-').toLowerCase();
            
            // Get data
            const data = this.getEstimateData();
            
            // Export based on format
            if (format === 'csv') {
                ExportUtil.downloadCSV(data, filename);
            } else if (format === 'json') {
                ExportUtil.downloadJSON(data, filename);
            }
        },
        
        getEstimateData: function() {
            // Calculate first to ensure data is up to date
            let totalLaborCost = 0;
            let totalMaterialCost = 0;
            const locationDetails = [];
            
            this.locations.forEach(location => {
                const locationData = location.getData();
                totalLaborCost += locationData.totalLaborCost;
                totalMaterialCost += locationData.totalMaterialCost;
                locationDetails.push(locationData);
            });
            
            // Get project info
            const projectName = document.getElementById('project-name').value || '';
            const projectDate = document.getElementById('project-date').value || '';
            const projectClient = document.getElementById('project-client').value || '';
            
            // Get additional costs
            const permitFees = parseFloat(document.getElementById('permitFees').value) || 0;
            const equipmentCosts = parseFloat(document.getElementById('equipmentCosts').value) || 0;
            const overheadCosts = parseFloat(document.getElementById('overheadCosts').value) || 0;
            const contingencyPercent = parseFloat(document.getElementById('contingencyPercent').value) || 0;
            
            // Calculate totals
            const directCost = totalLaborCost + totalMaterialCost;
            const subtotal = directCost + permitFees + equipmentCosts + overheadCosts;
            const contingency = (subtotal * contingencyPercent) / 100;
            const grandTotal = subtotal + contingency;
            
            return {
                projectName,
                projectDate,
                projectClient,
                permitFees,
                equipmentCosts,
                overheadCosts,
                contingencyPercent,
                laborCost: totalLaborCost,
                materialCost: totalMaterialCost,
                directCost: directCost,
                subtotal,
                contingency,
                grandTotal,
                locations: locationDetails,
                savedAt: new Date().toISOString()
            };
        }
    };
    
    // Initialize the app
    app.init();
    
    // Add first location by default
    app.addLocation();
    
    // Expose the app to the global scope for other components to use
    window.constructionApp = app;
});

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

// Initialize auto-save after the main app is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main app to initialize before starting auto-save
    setTimeout(() => {
        if (document.querySelector('.project-status')) {
            new AutoSaveStatus();
        }
    }, 1000);
});