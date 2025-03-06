/**
 * Spectre Divide Geoguessr Theme Switcher
 */

const THEMES = {
  S0: {
    name: "SPECTRE",
    file: "styles/S0_style.css",
    color: "#FFCB00",
    logo: "assets/Logos/SDGS0Logo.png",
    background: "assets/backgrounds/S0_background.png"
  },
  S1: {
    name: "FLASHPOINT",
    file: "styles/S1_style.css",
    color: "#C6EA34",
    logo: "assets/Logos/SDGS1Logo.png",
    background: "assets/backgrounds/S1_background.png"
  }
};

const THEME_KEYS = Object.keys(THEMES);
const DEFAULT_THEME = 'S0';
let currentThemeIndex = 0;
let themeButton = null;
let isTransitioning = false;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initThemeSwitcher);
if (document.readyState !== 'loading') initThemeSwitcher();

function initThemeSwitcher() {
  // Get saved theme
  const savedTheme = localStorage.getItem('spectreTheme') || DEFAULT_THEME;
  currentThemeIndex = Math.max(0, THEME_KEYS.indexOf(savedTheme));
  
  // Setup theme system
  preloadBackgrounds();
  addTransitionStyles();
  applyTheme(savedTheme, false);
  
  // Create theme button
  if (!document.getElementById('theme-button')) {
    createThemeButton();
  }
}

/**
 * Preload background images for all themes
 */
function preloadBackgrounds() {
  THEME_KEYS.forEach(key => {
    const img = new Image();
    img.src = THEMES[key].background;
  });
}

/**
 * Apply the selected theme
 */
function applyTheme(themeId, animate = true) {
  if (!THEMES[themeId] || isTransitioning) return;
  
  // Save selection
  localStorage.setItem('spectreTheme', themeId);
  
  if (animate) {
    isTransitioning = true;
    
    // If loading screen is active, update its theme immediately
    updateLoadingScreenTheme(themeId);
    
    // Fade out
    document.body.classList.add('theme-fade-out');
    
    setTimeout(() => {
      // Apply theme during fade
      switchThemeFiles(themeId);
      applyBackground(themeId);
      
      // Fade in
      setTimeout(() => {
        document.body.classList.remove('theme-fade-out');
        document.body.classList.add('theme-fade-in');
        
        // Complete transition
        setTimeout(() => {
          document.body.classList.remove('theme-fade-in');
          isTransitioning = false;
        }, 300);
      }, 50);
    }, 300);
  } else {
    // Direct apply without animation
    updateLoadingScreenTheme(themeId);
    switchThemeFiles(themeId);
    applyBackground(themeId);
  }
}

/**
 * Update loading screen theme
 */
function updateLoadingScreenTheme(themeId) {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;
  
  // Remove existing theme classes
  loadingScreen.classList.remove('spectre', 'flashpoint');
  
  // Add new theme class
  if (themeId === 'S1') {
    loadingScreen.classList.add('flashpoint');
  } else {
    loadingScreen.classList.add('spectre');
  }
  
  // Update logo
  const loadingLogo = document.getElementById('loading-logo');
  if (loadingLogo) {
    loadingLogo.src = THEMES[themeId].logo;
  }
}

/**
 * Apply background image directly
 */
function applyBackground(themeId) {
  // Get or create style element
  let styleEl = document.getElementById('theme-background-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'theme-background-style';
    document.head.appendChild(styleEl);
  }
  
  // Apply background via CSS
  styleEl.textContent = `
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image: url('${THEMES[themeId].background}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.1;
      z-index: 0;
    }
    .index-body::before { background-image: none; }
  `;
}

/**
 * Switch theme stylesheet
 */
function switchThemeFiles(themeId) {
  // Create new theme link
  const themeLink = document.createElement('link');
  themeLink.rel = 'stylesheet';
  themeLink.id = 'theme-css';
  themeLink.href = `${THEMES[themeId].file}?v=${Date.now()}`;
  
  // Handle theme loading
  themeLink.onload = () => {
    // Remove old theme links
    document.querySelectorAll('link[href*="S0_style.css"], link[href*="S1_style.css"]')
      .forEach(link => {
        if (link !== themeLink) link.remove();
      });
    
    // Update logo
    const logoElement = document.getElementById('logo-image');
    if (logoElement) logoElement.src = THEMES[themeId].logo;
    
    // Update button and data attribute
    updateButtonAppearance(themeId);
    document.body.setAttribute('data-theme', themeId);
  };
  
  document.head.appendChild(themeLink);
}

/**
 * Create theme switcher button
 */
function createThemeButton() {
  const themeContainer = document.createElement('div');
  themeContainer.className = 'theme-switcher-container';
  
  // Create button with current theme
  const currentTheme = THEME_KEYS[currentThemeIndex];
  themeContainer.innerHTML = `
    <button id="theme-button" class="theme-button" aria-label="Switch theme">
      <i class="fa-solid fa-palette"></i>
      <span class="theme-name">${THEMES[currentTheme].name}</span>
    </button>
  `;
  
  document.body.appendChild(themeContainer);
  themeButton = document.getElementById('theme-button');
  
  // Add click handler
  themeButton.addEventListener('click', function() {
    if (isTransitioning) return;
    
    // Cycle to next theme
    currentThemeIndex = (currentThemeIndex + 1) % THEME_KEYS.length;
    applyTheme(THEME_KEYS[currentThemeIndex], true);
  });
  
  addThemeButtonStyles();
}

/**
 * Update button appearance for current theme
 */
function updateButtonAppearance(themeId) {
  if (!themeButton) return;
  
  const nameSpan = themeButton.querySelector('.theme-name');
  if (nameSpan) nameSpan.textContent = THEMES[themeId].name;
}

/**
 * Add transition styles
 */
function addTransitionStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .theme-fade-out { opacity: 0; transition: opacity 300ms ease-out; }
    .theme-fade-in { opacity: 1; transition: opacity 300ms ease-in; }
    body { opacity: 1; transition: opacity 300ms ease; }
    body::before { transition: background-image 0ms ease-out; }
    body.theme-fade-out .theme-switcher-container,
    body.theme-fade-in .theme-switcher-container { opacity: 1; }
  `;
  document.head.appendChild(style);
}

/**
 * Add theme button styles
 */
function addThemeButtonStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .theme-switcher-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 999;
    }
    
    .theme-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      border-radius: 6px;
      font-family: 'DIN', 'Arial Narrow', Arial, sans-serif;
      font-size: 0.9rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #FFCB00;
      background-color: rgba(10, 10, 10, 0.85);
      border: 2px solid #FFCB00;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    
    .theme-button i { font-size: 1rem; }
    
    .theme-button:hover {
      border-color: #F73D72;
      color: #F73D72;
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4);
    }
    
    .theme-button:active {
      transform: translateY(2px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    body[data-theme="S1"] .theme-button {
      color: #C6EA34;
      border-color: #C6EA34;
    }
    
    body[data-theme="S1"] .theme-button:hover {
      border-color: #F73D72;
      color: #F73D72;
    }
    
    @media screen and (max-width: 768px) {
      .theme-switcher-container {
        position: fixed;
        top: 10px;
        right: 10px;
        margin: 0;
        display: flex;
        justify-content: center;
      }
      
      .theme-name { display: none; }
      
      .theme-button {
        padding: 0.5rem;
        width: 45px;
        height: 45px;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.75);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      }
      
      .theme-button i { font-size: 1.5rem; }
      
      .theme-button:hover {
        border-color: inherit;
        color: inherit;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        transform: none;
      }
      
      body[data-theme="S0"] .theme-button:hover {
        color: #FFCB00;
        border-color: #FFCB00;
      }
      
      body[data-theme="S1"] .theme-button:hover {
        color: #C6EA34;
        border-color: #C6EA34;
      }
    }
    
    @media screen and (max-width: 350px) {
      .theme-switcher-container {
        top: 5px;
        right: 5px;
      }
      
      .theme-button {
        width: 40px;
        height: 40px;
        padding: 0.4rem;
      }
    }
  `;
  document.head.appendChild(style);
}