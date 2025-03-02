/**
 * Theme Switcher for Spectre Divide Geoguessr
 * 
 * This script handles the theme switching functionality.
 * It loads the selected theme CSS file and saves the user's preference.
 */

// Available themes with their color information and logos
const THEMES = {
  S0: {
    name: "Season 0",
    file: "styles/S0_style.css",
    color: "#FFCB00",  // Yellow theme color
    logo: "assets/Logos/SDGS0Logo.png"
  },
  S1: {
    name: "Flashpoint",
    file: "styles/S1_style.css",
    color: "#C6EA34",  // Flashpoint green color
    logo: "assets/Logos/SDGS1Logo.png"
  }
};

// Default theme
const DEFAULT_THEME = 'S0';

// DOM elements
let themeLink = null;
let themeSwitcher = null;
let switcherContainer = null;

/**
 * Initialize the theme switcher
 */
function initThemeSwitcher() {
  // Create theme link element if it doesn't exist
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.id = 'theme-css';
    document.head.appendChild(themeLink);
  }
  
  // Load saved theme or default
  loadTheme(getSavedTheme());
  
  // Create theme switcher if it doesn't exist on the page yet
  if (!document.getElementById('theme-switcher') && document.body) {
    createThemeSwitcher();
  }
}

/**
 * Load a specific theme
 * @param {string} themeId - The ID of the theme to load
 */
function loadTheme(themeId) {
  if (!THEMES[themeId]) {
    themeId = DEFAULT_THEME;
  }
  
  // Update the CSS link
  themeLink.href = THEMES[themeId].file;
  
  // Update the logo if it exists
  const logoElement = document.getElementById('logo-image');
  if (logoElement) {
    logoElement.src = THEMES[themeId].logo;
  }
  
  // Save user preference
  localStorage.setItem('spectreTheme', themeId);
  
  // Update the switcher if it exists
  if (themeSwitcher) {
    themeSwitcher.value = themeId;
    
    // Apply theme color to the switcher container border
    if (switcherContainer) {
      switcherContainer.style.borderColor = THEMES[themeId].color;
      themeSwitcher.style.borderColor = THEMES[themeId].color;
    }
  }
}

/**
 * Get the saved theme from localStorage
 * @returns {string} - The saved theme ID or default theme
 */
function getSavedTheme() {
  return localStorage.getItem('spectreTheme') || DEFAULT_THEME;
}

/**
 * Create the theme switcher UI
 */
function createThemeSwitcher() {
  // Create container
  const container = document.createElement('div');
  container.className = 'theme-switcher-container';
  container.innerHTML = `
    <label for="theme-switcher">Theme:</label>
    <select id="theme-switcher">
      ${Object.entries(THEMES).map(([id, theme]) => 
        `<option value="${id}">${theme.name}</option>`
      ).join('')}
    </select>
  `;
  
  // Style the container
  container.style.position = 'fixed';
  container.style.top = '10px';
  container.style.right = '10px';
  container.style.zIndex = '1000';
  container.style.background = 'rgba(0,0,0,0.7)';
  container.style.padding = '5px 10px';
  container.style.borderRadius = '4px';
  container.style.color = '#fff';
  container.style.fontSize = '0.9rem';
  container.style.border = '2px solid'; // Will set color dynamically
  container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
  
  // Add to document
  document.body.appendChild(container);
  
  // Get the select element
  themeSwitcher = document.getElementById('theme-switcher');
  switcherContainer = container;
  
  // Style the select element
  themeSwitcher.style.backgroundColor = 'rgba(0,0,0,0.5)';
  themeSwitcher.style.color = '#fff';
  themeSwitcher.style.border = '1px solid'; // Will set color dynamically
  themeSwitcher.style.borderRadius = '3px';
  themeSwitcher.style.padding = '3px 5px';
  themeSwitcher.style.cursor = 'pointer';
  themeSwitcher.style.outline = 'none';
  
  // Set initial value
  themeSwitcher.value = getSavedTheme();
  
  // Apply initial color
  const initialTheme = getSavedTheme();
  container.style.borderColor = THEMES[initialTheme].color;
  themeSwitcher.style.borderColor = THEMES[initialTheme].color;
  
  // Add event listener
  themeSwitcher.addEventListener('change', function() {
    loadTheme(this.value);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initThemeSwitcher);

// Initialize immediately if document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initThemeSwitcher();
}