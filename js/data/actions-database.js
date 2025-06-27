/**
 * Construction Actions Database
 * Provides common construction actions with materials and subtasks
 */

const ActionsDatabase = {
  // Demolition activities
  demolition: {
    name: "Demolition",
    actions: [
      { 
        id: "demo_wall", 
        name: "Demolish Wall", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Disposal Bags",
            unit: "Bags",
            calculation: "Math.ceil(quantity / 20)", // 1 bag per 20 sq ft
            costPerUnit: 2.50
          }
        ],
        subTasks: [
          {
            name: "Debris Removal",
            unit: "Cu. Yd",
            calculation: "quantity * 0.25 / 27", // 3" thickness, convert to cubic yards
            costPerUnit: 50.00
          }
        ]
      },
      { 
        id: "demo_floor", 
        name: "Remove Flooring", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Disposal Bags",
            unit: "Bags",
            calculation: "Math.ceil(quantity / 30)", // 1 bag per 30 sq ft
            costPerUnit: 2.50
          }
        ],
        subTasks: [
          {
            name: "Debris Removal",
            unit: "Cu. Yd",
            calculation: "quantity * 0.08 / 27", // 1" thickness, convert to cubic yards
            costPerUnit: 50.00
          }
        ]
      }
    ]
  },
  
  // Framing activities
  framing: {
    name: "Framing",
    actions: [
      {
        id: "frame_interior_walls",
        name: "Frame Interior Walls",
        defaultUnit: "Linear Ft", // Represents the total linear footage of interior walls to be framed
        materials: [
          {
            name: "Dimensional Lumber (2x4 or 2x6)",
            unit: "Linear Ft",
            calculation: "Math.ceil(quantity * 3.0)", // Slightly reduced factor for interior walls (e.g., 3.0-3.25)
            costPerUnit: 0.75 // Example: cost per linear foot of lumber
          },
          {
            name: "Framing Nails",
            unit: "Lbs",
            calculation: "Math.ceil(quantity / 100)", // Approx. 1 lb of nails per 100 linear ft of interior wall
            costPerUnit: 3.00
          }
          
        ],
        subTasks: []
      },
      { 
        id: "frame_door", 
        name: "Frame Door Opening", 
        defaultUnit: "Count",
        materials: [
          {
            name: "2x4 Studs",
            unit: "Pcs",
            calculation: "quantity * 4", // 2 king studs, 2 jack studs
            costPerUnit: 5.50
          },
          {
            name: "2x6 Header",
            unit: "Pcs",
            calculation: "quantity * 1", // 1 header per door
            costPerUnit: 12.00
          }
        ],
        subTasks: []
      },{
        id: "frame_exterior_walls",
        name: "Frame Exterior Walls",
        defaultUnit: "Linear Ft", // Represents the total linear footage of walls to be framed
        materials: [
          {
            name: "Dimensional Lumber (2x4 or 2x6)",
            unit: "Linear Ft", // Total linear footage of lumber needed (studs, plates, headers)
            calculation: "Math.ceil(quantity * 3.5)", // Approx. 3.5 linear ft of lumber per linear ft of wall (accounts for studs, plates, headers, blocking, etc.)
            costPerUnit: 0.75 // Example: cost per linear foot of lumber
          },
          {
            name: "Framing Nails",
            unit: "Lbs",
            calculation: "Math.ceil(quantity / 75)", // Approx. 1 lb of nails per 75 linear ft of wall
            costPerUnit: 3.00
          },
          {
            name: "OSB Sheathing (7/16\")",
            unit: "Sheets",
            calculation: "Math.ceil((quantity * 8 / 32) * 1.10)", // Quantity (linear ft of wall) * 8 (assumed wall height in ft) / 32 (sq ft per 4x8 sheet) * 1.10 (10% overage)
            costPerUnit: 25.00
          },
          {
            name: "House Wrap",
            unit: "Sq. Ft",
            calculation: "Math.ceil((quantity * 8) * 1.10)", // Quantity (linear ft of wall) * 8 (assumed wall height in ft) * 1.10 (10% overage)
            costPerUnit: 0.15
          }
        ],
        subTasks: []
      },
	  {
        id: "frame_sliding_glass_door",
        name: "Frame Sliding Glass Door Opening",
        defaultUnit: "Each", // Represents one door opening
        materials: [
          {
            name: "Header Lumber (e.g., (2) 2x10s or similar)",
            unit: "Linear Ft",
            calculation: "Math.ceil(quantity * 10)", // Quantity is '1' for 'Each' door. Approx 10 linear feet of header material per door
            costPerUnit: 1.50 // Example cost per linear foot for header material
          },
          {
            name: "Framing Lumber (King/Jack Studs, Cripples)",
            unit: "Linear Ft",
            calculation: "Math.ceil(quantity * 30)", // Quantity is '1'. Approx 30 linear feet for studs around the opening
            costPerUnit: 0.75 // Example cost per linear foot of framing lumber
          },
          {
            name: "Framing Nails",
            unit: "Lbs",
            calculation: "Math.ceil(quantity * 0.5)", // Quantity is '1'. Approx 0.5 lbs of nails per door opening
            costPerUnit: 3.00 // Example cost per pound of framing nails
          }
        ],
        subTasks: []
      }
    ]
  },
  
  // Drywall activities
  drywall: {
    name: "Drywall",
    actions: [
      { 
        id: "drywall_hang", 
        name: "Hang Drywall", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Drywall Sheets",
            unit: "Sheets",
            calculation: "Math.ceil(quantity / 32)", // 4'x8' sheet = 32 sq ft
            costPerUnit: 15.00 
          },
          {
            name: "Drywall Screws",
            unit: "Lbs",
            calculation: "Math.ceil(quantity / 32 * 0.5)", // 0.5 lb per sheet
            costPerUnit: 4.50
          }
        ],
        subTasks: []
      },
      { 
        id: "drywall_tape", 
        name: "Tape and Mud Drywall", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Mesh Tape",
            unit: "Lin. Ft",
            calculation: "Math.ceil((quantity / 32 * 12) + (2 * Math.sqrt(quantity) * 2))", // sheet joints + perimeter
            costPerUnit: 0.05
          },
          {
            name: "Joint Compound",
            unit: "Gallons",
            calculation: "Math.ceil(quantity / 100)", // 1 gallon per 100 sq ft
            costPerUnit: 18.00
          }
        ],
        subTasks: []
      },
      { 
        id: "drywall_texture", 
        name: "Texture Drywall", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Texture Spray",
            unit: "Cans",
            calculation: "Math.ceil(quantity / 80)", // 1 can per 80 sq ft
            costPerUnit: 12.00
          }
        ],
        subTasks: []
      },
      { 
        id: "drywall_complete", 
        name: "Complete Drywall Installation", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Drywall Sheets",
            unit: "Sheets",
            calculation: "Math.ceil(quantity / 32)", // 4'x8' sheet = 32 sq ft
            costPerUnit: 20.00 ,
			laborPerUnit: 10.00,
			minLaborPerUnit: 10.00
          },
          {
            name: "Drywall Screws",
            unit: "Unit",
            calculation: "Math.ceil(quantity)", // 1 per sq. ft.
            costPerUnit: 4.50
          },
          {
            name: "Mesh Tape",
            unit: "Lin. Ft",
            calculation: "Math.ceil((quantity / 32 * 12) + (2 * Math.sqrt(quantity) * 2))", // sheet joints + perimeter
            costPerUnit: 0.05
          },
          {
            name: "Joint Compound",
            unit: "Gallons",
            calculation: "Math.ceil(quantity / 100)", // 1 gallon per 100 sq ft
            costPerUnit: 18.00
          },
          {
            name: "Texture Spray",
            unit: "Cans",
            calculation: "Math.ceil(quantity / 80)", // 1 can per 80 sq ft
            costPerUnit: 12.00
          }
        ],
        subTasks: []
      }
    ]
  },
  
  // Flooring activities
  flooring: {
    name: "Flooring",
    actions: [
      { 
        id: "floor_hardwood", 
        name: "Install Hardwood Flooring", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Hardwood Planks",
            unit: "Sq. Ft",
            calculation: "quantity * 1.1", // 10% waste
            costPerUnit: 8.00
          },
          {
            name: "Underlayment",
            unit: "Sq. Ft",
            calculation: "quantity",
            costPerUnit: 0.50
          },
          {
            name: "Wood Flooring Nails",
            unit: "Lbs",
            calculation: "Math.ceil(quantity / 50)", // 1 lb per 50 sq ft
            costPerUnit: 3.50
          }
        ],
        subTasks: []
      },
      { 
        id: "floor_tile", 
        name: "Install Tile Flooring", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Tile",
            unit: "Sq. Ft",
            calculation: "quantity * 1.1", // 10% waste
            costPerUnit: 6.00
          },
          {
            name: "Tile Adhesive",
            unit: "Gallons",
            calculation: "Math.ceil(quantity / 80)", // 1 gallon per 80 sq ft
            costPerUnit: 45.00
          },
          {
            name: "Grout",
            unit: "Lbs",
            calculation: "Math.ceil(quantity / 20)", // 1 lb per 20 sq ft
            costPerUnit: 3.00
          },
          {
            name: "Spacers",
            unit: "Bags",
            calculation: "Math.ceil(quantity / 100)", // 1 bag per 100 sq ft
            costPerUnit: 5.00
          }
        ],
        subTasks: []
      }
    ]
  },
  
  // Painting activities
  painting: {
    name: "Painting",
    actions: [
      { 
        id: "paint_interior", 
        name: "Paint Interior Walls", 
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Primer",
            unit: "Gallons",
            calculation: "Math.ceil(quantity / 400)", // 1 gallon covers 400 sq ft
            costPerUnit: 25.00
          },
          {
            name: "Paint",
            unit: "Gallons",
            calculation: "Math.ceil(quantity / 350)", // 1 gallon covers 350 sq ft
            costPerUnit: 35.00
          },
          {
            name: "Painter's Tape",
            unit: "Rolls",
            calculation: "Math.ceil(quantity / 200)", // 1 roll per 200 sq ft
            costPerUnit: 7.00
          },
          {
            name: "Drop Cloths",
            unit: "Each",
            calculation: "Math.ceil(quantity / 500)", // 1 cloth per 500 sq ft
            costPerUnit: 10.00
          }
        ],
        subTasks: []
      }
    ]
  },
  
  // Subfloor activities
  subfloor: {
    name: "Subfloor",
    actions: [
      {
        id: "install_plywood_subfloor",
        name: "Install Plywood Subfloor",
        defaultUnit: "Sq. Ft",
        materials: [
          {
            name: "Plywood Sheeting",
            unit: "Sheets",
            calculation: "Math.ceil(quantity / 32) * 1.10", // 4x8 ft sheet; 10% overage.
            costPerUnit: 30.00
          },
          {
            name: "Great Stuff Pro Adhesive",
            unit: "Tubes",
            calculation: "Math.ceil(quantity / 350)", // 1 tube covers approx 350 sq ft
            costPerUnit: 20.00
          },
          {
            name: "2 in. Construction Screws",
            unit: "Count",
            calculation: "Math.ceil((quantity * 0.75) + (8 * Math.sqrt(quantity)))", // assume 16" OC.  Every 6" perimiter.  Every 12" interior.  Square room.
            costPerUnit: 0.15
          }
        ],
        subTasks: []
      }
    ]
  },
  
  // Window activities
  install_windows: {
    name: "Install Windows",
    actions: [
      {
        id: "install_standard_window",
        name: "Install Standard Window",
        defaultUnit: "Each", // Represents each window being installed
        materials: [
          {
            name: "Window Shims",
            unit: "Bundles",
            calculation: "Math.ceil(quantity * 0.5)", // Approx. 0.5 bundles per window
            costPerUnit: 5.00
          },
          {
            name: "Low-Expansion Spray Foam Sealant",
            unit: "Cans",
            calculation: "Math.ceil(quantity * 0.3)", // Approx. 0.3 cans per window
            costPerUnit: 10.00
          },
          {
            name: "Exterior Window Sealant/Caulking",
            unit: "Tubes",
            calculation: "Math.ceil(quantity * 0.2)", // Approx. 0.2 tubes per window
            costPerUnit: 8.00
          },
          {
            name: "Window Fasteners/Screws",
            unit: "Boxes",
            calculation: "Math.ceil(quantity * 0.1)", // Approx. 0.1 boxes per window
            costPerUnit: 15.00
          }
        ],
        subTasks: []
      }
    ]
  },
  
	//Door activities
  install_doors: {
    name: "Install Doors",
    actions: [
      {
        id: "install_interior_door",
        name: "Install Interior Door",
        defaultUnit: "Each", // Represents each interior door being installed
        materials: [
          {
            name: "Interior Door Unit (Pre-hung or Slab)",
            unit: "Each",
            calculation: "Math.ceil(quantity)",
            costPerUnit: 150.00 // Example: average cost for a standard interior door unit
          },
          {
            name: "Door Hardware (Hinges, Knob/Lever)",
            unit: "Sets",
            calculation: "Math.ceil(quantity)",
            costPerUnit: 35.00
          },
          {
            name: "Door Casing/Trim",
            unit: "Linear Ft",
            calculation: "Math.ceil(quantity * 20)", // Approx 20 linear feet of trim per door (both sides)
            costPerUnit: 1.00
          },
          {
            name: "Wood Shims",
            unit: "Bundles",
            calculation: "Math.ceil(quantity * 0.5)", // Approx 0.5 bundles per door
            costPerUnit: 5.00
          },
          {
            name: "Finish Nails/Screws",
            unit: "Lbs",
            calculation: "Math.ceil(quantity * 0.1)", // Approx 0.1 lbs per door
            costPerUnit: 3.00
          }
        ],
        subTasks: []
      },
      {
        id: "install_exterior_door",
        name: "Install Exterior Door",
        defaultUnit: "Each", // Represents each exterior door being installed
        materials: [
          {
            name: "Exterior Door Unit (Pre-hung)",
            unit: "Each",
            calculation: "Math.ceil(quantity)",
            costPerUnit: 600.00 // Example: average cost for a standard exterior door unit
          },
          {
            name: "Exterior Door Hardware (Lockset, Deadbolt)",
            unit: "Sets",
            calculation: "Math.ceil(quantity)",
            costPerUnit: 75.00
          },
          {
            name: "Exterior Door Casing/Trim",
            unit: "Linear Ft",
            calculation: "Math.ceil(quantity * 12)", // Approx 12 linear feet of exterior trim per door
            costPerUnit: 1.50
          },
          {
            name: "Wood Shims",
            unit: "Bundles",
            calculation: "Math.ceil(quantity * 0.5)", // Approx 0.5 bundles per door
            costPerUnit: 5.00
          },
          {
            name: "Exterior Grade Fasteners/Screws",
            unit: "Lbs",
            calculation: "Math.ceil(quantity * 0.2)", // Approx 0.2 lbs per door
            costPerUnit: 5.00
          },
          {
            name: "Low-Expansion Spray Foam Insulation",
            unit: "Cans",
            calculation: "Math.ceil(quantity * 0.5)", // Approx 0.5 cans per door
            costPerUnit: 10.00
          },
          {
            name: "Exterior Sealant/Caulking",
            unit: "Tubes",
            calculation: "Math.ceil(quantity * 0.3)", // Approx 0.3 tubes per door
            costPerUnit: 8.00
          },
          {
            name: "Flashing Tape",
            unit: "Rolls",
            calculation: "Math.ceil(quantity * 0.2)", // Approx 0.2 rolls per door
            costPerUnit: 20.00
          }
        ],
        subTasks: []
      }
    ]
  },
  
  //roof activities
  install_roof: {
    name: "Install Roof",
    actions: [
      {
        id: "install_class_a_roof",
        name: "Install Class A Roof",
        defaultUnit: "Sq. Ft", // Represents the total square footage of the roof area
        materials: [
          {
            name: "Class A Roofing Shingles/Tiles",
            unit: "Bundles",
            calculation: "Math.ceil(quantity / 100 * 3 * 1.10)", // 3 bundles per 100 sq ft, plus 10% overage for waste, hips, ridges, etc.
            costPerUnit: 50.00 // Example cost per bundle for Class A material
          },
          {
            name: "Roofing Underlayment (Synthetic or Felt)",
            unit: "Rolls",
            calculation: "Math.ceil(quantity / 1000 * 1.05)", // Standard roll covers approx 1000 sq ft, plus 5% overage
            costPerUnit: 100.00
          },
          {
            name: "Roofing Nails (Galvanized)",
            unit: "Lbs",
            calculation: "Math.ceil(quantity / 100 * 0.2)", // Approx 0.2 lbs of nails per 100 sq ft
            costPerUnit: 3.00
          },
          {
            name: "Drip Edge",
            unit: "Linear Ft",
            // Assumes a square roof for perimeter calculation: 4 * sqrt(area)
            calculation: "Math.ceil((4 * Math.sqrt(quantity)) * 1.05)", // Perimeter with 5% overage
            costPerUnit: 2.00
          },
          {
            name: "Coping Material",
            unit: "Linear Ft",
            // Assumes a square roof for perimeter calculation, used for parapet walls or roof edges
            calculation: "Math.ceil((4 * Math.sqrt(quantity)) * 1.10)", // Perimeter with 10% overage
            costPerUnit: 8.00 // Example cost for metal coping
          },
          {
            name: "Gutter Material (Seamless Aluminum)",
            unit: "Linear Ft",
            // Assumes a square roof for perimeter calculation, covering all sides
            calculation: "Math.ceil((4 * Math.sqrt(quantity)) * 1.10)", // Perimeter with 10% overage
            costPerUnit: 6.00 // Example cost per linear foot for gutters
          },
          {
            name: "Gutter Downspouts",
            unit: "Each",
            calculation: "Math.ceil(quantity / 1000)", // Approx. one downspout per 1000 sq ft of roof area
            costPerUnit: 30.00
          },
          {
            name: "Gutter Hangers/Brackets",
            unit: "Each",
            // One bracket every approx. 3 feet of gutter, plus 5% overage
            calculation: "Math.ceil((4 * Math.sqrt(quantity)) / 3 * 1.05)",
            costPerUnit: 2.50
          },
          {
            name: "Roof Vents (e.g., Ridge Vent or Box Vents)",
            unit: "Each",
            calculation: "Math.ceil(quantity / 1500)", // Approx. one vent per 1500 sq ft (can vary by type/code)
            costPerUnit: 25.00
          },
          {
            name: "Roofing Sealants/Caulking (Roofing Grade)",
            unit: "Tubes",
            calculation: "Math.ceil(quantity / 500)", // Approx. 1 tube per 500 sq ft for flashing, penetrations, etc.
            costPerUnit: 8.00
          }
        ],
        subTasks: []
      }
    ]
  },


  // Get a flattened list of all actions
  getAllActions: function() {
    let allActions = [];
    
    for (const category in this) {
      if (typeof this[category] === 'object' && this[category].actions) {
        allActions = allActions.concat(this[category].actions.map(action => ({
          ...action,
          category: this[category].name
        })));
      }
    }
    
    return allActions;
  },
  
  // Search actions based on input text
  searchActions: function(text) {
    if (!text) return [];
    
    const searchText = text.toLowerCase();
    const results = [];
    
    for (const category in this) {
      if (typeof this[category] === 'object' && this[category].actions) {
        const matchingActions = this[category].actions.filter(action => 
          action.name.toLowerCase().includes(searchText)
        );
        
        if (matchingActions.length > 0) {
          results.push({
            category: this[category].name,
            actions: matchingActions
          });
        }
      }
    }
    
    return results;
  },
  
  // Get action by ID
  getActionById: function(id) {
    for (const category in this) {
      if (typeof this[category] === 'object' && this[category].actions) {
        const action = this[category].actions.find(a => a.id === id);
        if (action) return action;
      }
    }
    return null;
  },
  
  // Calculate material costs and quantities for an action
  calculateMaterialsAndSubtasks: function(actionId, quantity) {
    const action = this.getActionById(actionId);
    if (!action || !quantity) return { materials: [], subtasks: [], totalMaterialCost: 0 };
    
    const materials = [];
    let totalMaterialCost = 0;
    
    // Calculate materials
    if (action.materials && action.materials.length > 0) {
      action.materials.forEach(material => {
        // Use the calculation formula to determine quantity needed
        const calculationFn = new Function('quantity', `return ${material.calculation}`);
        const calculatedQuantity = calculationFn(quantity);
        
        const materialCost = calculatedQuantity * material.costPerUnit;
        totalMaterialCost += materialCost;
        
        materials.push({
          name: material.name,
          quantity: calculatedQuantity,
          unit: material.unit,
          costPerUnit: material.costPerUnit,
          totalCost: materialCost
        });
      });
    }
    
    // Calculate subtasks
    const subtasks = [];
    if (action.subTasks && action.subTasks.length > 0) {
      action.subTasks.forEach(subtask => {
        // Use the calculation formula to determine quantity needed
        const calculationFn = new Function('quantity', `return ${subtask.calculation}`);
        const calculatedQuantity = calculationFn(quantity);
        
        const subtaskCost = calculatedQuantity * subtask.costPerUnit;
        totalMaterialCost += subtaskCost;
        
        subtasks.push({
          name: subtask.name,
          quantity: calculatedQuantity,
          unit: subtask.unit,
          costPerUnit: subtask.costPerUnit,
          totalCost: subtaskCost
        });
      });
    }
    
    return {
      materials,
      subtasks,
      totalMaterialCost
    };
  }
};
