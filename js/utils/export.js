/**
 * Export Utility
 * Functions for exporting estimates to different formats
 */

const ExportUtil = {
    /**
     * Convert data to CSV format
     * @param {Object} data - The estimate data
     * @return {string} CSV string
     */
    toCSV: function(data) {
        if (!data || !data.locations) {
            return '';
        }
        
        // Create header row
        let csv = 'Location,Action,Quantity,Unit,Unit Price,Total Price\n';
        
        // Add data rows
        data.locations.forEach(location => {
            if (location.actions && location.actions.length) {
                location.actions.forEach(action => {
                    const row = [
                        `"${location.name}"`,
                        `"${action.name}"`,
                        action.quantity,
                        `"${action.unit}"`,
                        action.unitPrice.toFixed(2),
                        action.totalPrice.toFixed(2)
                    ];
                    csv += row.join(',') + '\n';
                });
            } else {
                // Location with no actions
                csv += `"${location.name}",,,,,${location.totalCost.toFixed(2)}\n`;
            }
        });
        
        // Add summary row
        csv += '\n';
        csv += `"SUMMARY",,,,,\n`;
        csv += `"Direct Costs",,,,${data.directCost.toFixed(2)},\n`;
        csv += `"Permit Fees",,,,${data.permitFees.toFixed(2)},\n`;
        csv += `"Equipment Costs",,,,${data.equipmentCosts.toFixed(2)},\n`;
        csv += `"Overhead Costs",,,,${data.overheadCosts.toFixed(2)},\n`;
        csv += `"Subtotal",,,,${data.subtotal.toFixed(2)},\n`;
        csv += `"Contingency (${data.contingencyPercent}%)",,,,${data.contingency.toFixed(2)},\n`;
        csv += `"GRAND TOTAL",,,,${data.grandTotal.toFixed(2)},\n`;
        
        return csv;
    },
    
    /**
     * Export data as CSV file
     * @param {Object} data - The estimate data
     * @param {string} filename - The filename without extension
     */
    downloadCSV: function(data, filename = 'construction-estimate') {
        const csv = this.toCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.csv`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * Convert data to JSON format
     * @param {Object} data - The estimate data
     * @return {string} JSON string
     */
    toJSON: function(data) {
        return JSON.stringify(data, null, 2);
    },
    
    /**
     * Export data as JSON file
     * @param {Object} data - The estimate data
     * @param {string} filename - The filename without extension
     */
    downloadJSON: function(data, filename = 'construction-estimate') {
        const json = this.toJSON(data);
        const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.json`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * Print the current estimate
     */
    print: function() {
        window.print();
    },

    /**
     * Initialize print styles
     * Called once on application load
     */
    initPrintStyles: function() {
        const printStyle = document.createElement('style');
        printStyle.textContent = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #result, #result * {
                    visibility: visible;
                }
                #result {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .no-print {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(printStyle);
    }
};

// Initialize print styles
ExportUtil.initPrintStyles();