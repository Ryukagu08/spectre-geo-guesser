/**
 * Theme Switcher for Spectre Divide Geoguessr
 */

// Available themes configuration
const THEMES = {
  S0: {
    name: "SPECTRE",
    file: "styles/S0_style.css",
    color: "#FFCB00",
    logo: "assets/Logos/SDGS0Logo.png"
  },
  S1: {
    name: "FLASHPOINT",
    file: "styles/S1_style.css",
    color: "#C6EA34",
    logo: "assets/Logos/SDGS1Logo.png"
  }
};

const DEFAULT_THEME = 'S0';
let themeLink = null;
let themeSwitcher = null;

function initThemeSwitcher() {
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.id = 'theme-css';
    document.head.appendChild(themeLink);
  }
  
  loadTheme(localStorage.getItem('spectreTheme') || DEFAULT_THEME);
  
  if (!document.getElementById('theme-switcher') && document.body) {
    createStylizedThemeSwitcher();
  }
}

function loadTheme(themeId) {
  if (!THEMES[themeId]) {
    themeId = DEFAULT_THEME;
  }
  
  themeLink.href = THEMES[themeId].file;
  
  const logoElement = document.getElementById('logo-image');
  if (logoElement) {
    logoElement.src = THEMES[themeId].logo;
  }
  
  document.body.setAttribute('data-theme', themeId);
  localStorage.setItem('spectreTheme', themeId);
  
  if (themeSwitcher) {
    themeSwitcher.value = themeId;
  }
}

function createStylizedThemeSwitcher() {
  const themeContainer = document.createElement('div');
  themeContainer.className = 'theme-switcher-container';
  themeContainer.innerHTML = `
    <div class="theme-select-wrapper">
      <select id="theme-switcher" aria-label="Select theme">
        ${Object.entries(THEMES).map(([id, theme]) => 
          `<option value="${id}">${theme.name}</option>`
        ).join('')}
      </select>
    </div>
  `;
  
  document.body.appendChild(themeContainer);
  themeSwitcher = document.getElementById('theme-switcher');
  themeSwitcher.value = localStorage.getItem('spectreTheme') || DEFAULT_THEME;
  
  themeSwitcher.addEventListener('change', function() {
    loadTheme(this.value);
  });
  
  addThemeSwitcherStyles();
}

function addThemeSwitcherStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .theme-switcher-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 100;
      display: flex;
      align-items: center;
    }
    
    .theme-select-wrapper {
      position: relative;
      width: 160px;
    }
    
    #theme-switcher {
      appearance: none;
      width: 100%;
      padding: 0.6rem 2.5rem 0.6rem 1rem;
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
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1);
      outline: none;
    }
    
    .theme-select-wrapper::after {
      content: '\\f078';
      font-family: 'Font Awesome 6 Free';
      font-weight: 900;
      font-size: 0.8rem;
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #FFCB00;
      pointer-events: none;
      transition: all 0.2s ease;
    }
    
    #theme-switcher:hover {
      border-color: #F73D72;
      color: #F73D72;
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4), 0 1px 18px rgba(0, 0, 0, 0.1);
    }
    
    #theme-switcher:active {
      transform: translateY(0);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .theme-select-wrapper:hover::after {
      color: #F73D72;
    }
    
    #theme-switcher option {
      background-color: #141414;
      color: #F2F2F2;
      font-weight: normal;
      padding: 10px;
    }
    
    body[data-theme="S1"] #theme-switcher {
      color: #C6EA34;
      border-color: #C6EA34;
    }
    
    body[data-theme="S1"] .theme-select-wrapper::after {
      color: #C6EA34;
    }
    
    body[data-theme="S1"] #theme-switcher:hover {
      border-color: #F73D72;
      color: #F73D72;
    }
    
    body[data-theme="S1"] .theme-select-wrapper:hover::after {
      color: #F73D72;
    }
    
    @media screen and (max-width: 768px) {
      .theme-switcher-container {
        position: relative;
        top: auto;
        right: auto;
        margin: 0.5rem auto;
        justify-content: center;
      }
      
      .theme-select-wrapper {
        width: 140px;
      }
      
      #theme-switcher {
        font-size: 0.8rem;
        padding: 0.5rem 2rem 0.5rem 0.8rem;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}

document.addEventListener('DOMContentLoaded', initThemeSwitcher);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initThemeSwitcher();
}