import { loadData } from "./data.js";
import { setupEventListeners } from "./events.js";
import { toggleVisibility } from "./ui.js";

// Load JSON data on window load
window.onload = async () => {
    
    await loadData();
    setupEventListeners();
        
    // Ensure confirmation buttons are hidden on initial load
    //document.getElementById("btn-yes").style.visibility = "hidden";
    //document.getElementById("btn-no").style.visibility = "hidden";
    toggleVisibility(false, "btn-yes", "btn-no");
};