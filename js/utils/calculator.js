/**
 * Construction Cost Calculator Utility
 * Handles the calculation of construction costs based on input data
 */

function calculateCost(locations) {
    const resultDiv = document.getElementById("result");
    let totalLaborCost = 0;
    let totalMaterialCost = 0;
    let locationDetails = [];
    
    // Process all locations
    locations.forEach(location => {
        const locationData = location.getData();
        totalLaborCost += locationData.totalLaborCost;
        totalMaterialCost += locationData.totalMaterialCost;
        locationDetails.push(locationData);
    });
    
    // Get additional costs
    const permitFees = parseFloat(document.getElementById("permitFees").value) || 0;
    const equipmentCosts = parseFloat(document.getElementById("equipmentCosts").value) || 0;
    const overheadCosts = parseFloat(document.getElementById("overheadCosts").value) || 0;
    const contingencyPercent = parseFloat(document.getElementById("contingencyPercent").value) || 0;
    
    // Calculate direct costs
    const directCost = totalLaborCost + totalMaterialCost;
    
    // Calculate subtotal
    const subtotal = directCost + permitFees + equipmentCosts + overheadCosts;
    
    // Calculate contingency
    const contingency = (subtotal * contingencyPercent) / 100;
    
    // Calculate grand total
    const grandTotal = subtotal + contingency;
    
    // Create the result HTML
    renderResults({
        laborCost: totalLaborCost,
        materialCost: totalMaterialCost,
        directCost: directCost,
        permitFees: permitFees,
        equipmentCosts: equipmentCosts,
        overheadCosts: overheadCosts,
        subtotal: subtotal,
        contingencyPercent: contingencyPercent,
        contingency: contingency,
        grandTotal: grandTotal,
        locations: locationDetails
    });
}

function renderResults(data) {
    const resultDiv = document.getElementById("result");
    
    // Create summary section
    let resultHTML = `
        <h3>Cost Estimate Summary</h3>
        <ul>
            <li><strong>Labor Costs:</strong> ${formatCurrency(data.laborCost)}</li>
            <li><strong>Material Costs:</strong> ${formatCurrency(data.materialCost)}</li>
            <li><strong>Direct Costs Subtotal:</strong> ${formatCurrency(data.directCost)}</li>
            <li><strong>Permit Fees:</strong> ${formatCurrency(data.permitFees)}</li>
            <li><strong>Equipment Costs:</strong> ${formatCurrency(data.equipmentCosts)}</li>
            <li><strong>Overhead Costs:</strong> ${formatCurrency(data.overheadCosts)}</li>
            <li><strong>Subtotal:</strong> ${formatCurrency(data.subtotal)}</li>
            <li><strong>Contingency (${data.contingencyPercent}%):</strong> ${formatCurrency(data.contingency)}</li>
        </ul>
        
        <div class="grand-total">Grand Total: ${formatCurrency(data.grandTotal)}</div>
    `;
    
    // Add detailed breakdown by location
    if (data.locations.length > 0) {
        resultHTML += `<h3>Detailed Breakdown</h3>`;
        
        data.locations.forEach(location => {
            resultHTML += `
                <div class="location-summary">
                    <h4>${location.name}</h4>
                    <p>
                        <strong>Location Total:</strong> 
                        <span class="cost-highlight">${formatCurrency(location.totalCost)}</span>
                        (Labor: ${formatCurrency(location.totalLaborCost)}, Materials: ${formatCurrency(location.totalMaterialCost)})
                    </p>
            `;
            
            if (location.actions.length > 0) {
                resultHTML += `
                <div class="location-actions">
                    <table class="actions-table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Labor</th>
                                <th>Materials</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                location.actions.forEach(action => {
                    resultHTML += `
                        <tr>
                            <td>${action.name}</td>
                            <td>${action.description || '-'}</td>
                            <td>${action.quantity.toFixed(2)}</td>
                            <td>${action.unit}</td>
                            <td>${formatCurrency(action.laborCost)}</td>
                            <td>${formatCurrency(action.materialCost)}</td>
                            <td class="price-cell">${formatCurrency(action.totalPrice)}</td>
                        </tr>
                    `;
                    
                    // Add material details if available
                    if (action.materials && action.materials.length > 0) {
                        resultHTML += `
                            <tr class="materials-row">
                                <td colspan="7" class="materials-details">
                                    <div class="materials-title">Materials:</div>
                                    <table class="nested-materials-table">
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
                        
                        action.materials.forEach(material => {
                            resultHTML += `
                                <tr>
                                    <td>${material.name}</td>
                                    <td>${material.quantity.toFixed(2)}</td>
                                    <td>${material.unit}</td>
                                    <td>${formatCurrency(material.costPerUnit)}</td>
                                    <td>${formatCurrency(material.totalCost)}</td>
                                </tr>
                            `;
                        });
                        
                        resultHTML += `
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        `;
                    }
                    
                    // Add subtask details if available
                    if (action.subtasks && action.subtasks.length > 0) {
                        resultHTML += `
                            <tr class="subtasks-row">
                                <td colspan="7" class="subtasks-details">
                                    <div class="subtasks-title">Subtasks:</div>
                                    <table class="nested-subtasks-table">
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
                        
                        action.subtasks.forEach(subtask => {
                            resultHTML += `
                                <tr>
                                    <td>${subtask.name}</td>
                                    <td>${subtask.quantity.toFixed(2)}</td>
                                    <td>${subtask.unit}</td>
                                    <td>${formatCurrency(subtask.costPerUnit)}</td>
                                    <td>${formatCurrency(subtask.totalCost)}</td>
                                </tr>
                            `;
                        });
                        
                        resultHTML += `
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        `;
                    }
                });
                
                resultHTML += `
                        </tbody>
                    </table>
                </div>
                `;
            }
            
            resultHTML += `</div>`;
        });
    }
    
    resultDiv.innerHTML = resultHTML;
}
