import { shuffleArray } from "./utils.js";
import { changeImage } from "./ui.js";

export let jsonData = null;
export let currentImageData = null;
export let flattenedImages = [];

// Image loading system
const imageCache = {};
let loadingScreen = null;
let progressBar = null;
let loadingLogo = null;
let isLoading = false;
let totalImagesToPreload = 0;
let imagesPreloaded = 0;
const maps = ["Mill", "Metro", "Skyway", "Commons", "Canal"];

/**
 * Loads the location data from JSON file and initializes the game
 */
export const loadData = async () => {
    // Initialize loading screen elements
    initLoadingScreen();
    
    // Show loading screen
    showLoading(true);
    
    try {
        // Load data
        const response = await fetch("data/data.json");
        jsonData = await response.json();
        createDataArray();
        
        // Set up preloading
        totalImagesToPreload = Math.min(5, flattenedImages.length);
        imagesPreloaded = 0;
        
        // Preload initial batch of images
        await preloadInitialImages();
        
        // Get the first image
        getRandomImage();
        
        // Hide loading screen
        hideLoading();
    } catch (error) {
        console.error("Error loading JSON:", error);
        hideLoading();
    }
};

/**
 * Creates a flattened array of images from all maps and randomizes their order
 */
const createDataArray = () => {
    for (let map in jsonData.Maps) {
        for (let imageKey in jsonData.Maps[map]) {
            flattenedImages.push({ map, imageKey, imageData: jsonData.Maps[map][imageKey] });
        }
    }
    shuffleArray(flattenedImages);
}

/**
 * Gets the next image from the randomized array and updates the display
 */
export let getRandomImage = () => {
    if (flattenedImages.length > 0) {
        currentImageData = flattenedImages.shift();
        
        // Check if the image is already cached
        const imagePath = `assets/${currentImageData.map}Images/${currentImageData.imageData.name}.jpg`;
        if (imageCache[imagePath]) {
            changeImage(currentImageData);
        } else {
            // Show mini loading state for the image
            document.querySelector(".quiz-image").classList.add("is-loading");
            
            // Load the image
            const img = new Image();
            img.onload = () => {
                imageCache[imagePath] = true;
                changeImage(currentImageData);
                document.querySelector(".quiz-image").classList.remove("is-loading");
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${imagePath}`);
                changeImage(currentImageData);
                document.querySelector(".quiz-image").classList.remove("is-loading");
            };
            img.src = imagePath;
        }
        
        // Preload next batch
        preloadNextBatchOfImages();
    }
};

/**
 * Initialize loading screen elements
 */
function initLoadingScreen() {
    loadingScreen = document.getElementById('loading-screen');
    progressBar = document.getElementById('loading-progress-bar');
    loadingLogo = document.getElementById('loading-logo');
}

/**
 * Show the loading screen
 */
function showLoading(withProgress = true) {
    if (!loadingScreen || isLoading) return;
    
    isLoading = true;
    
    // Update logo to match current theme
    const currentTheme = document.body.getAttribute('data-theme') || 'S0';
    if (loadingLogo) {
        loadingLogo.src = currentTheme === 'S0' ? 
            'assets/Logos/SDGS0Logo.png' : 
            'assets/Logos/SDGS1Logo.png';
    }
    
    // Reset progress
    if (progressBar) {
        progressBar.style.width = withProgress ? '0%' : '100%';
    }
    
    // Show the loading screen
    loadingScreen.classList.add('active');
}

/**
 * Hide the loading screen
 */
function hideLoading() {
    if (!loadingScreen || !isLoading) return;
    
    // Complete the progress animation
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    // Short delay to show completion
    setTimeout(() => {
        loadingScreen.classList.remove('active');
        isLoading = false;
        
        // Reset progress after animation completes
        setTimeout(() => {
            if (progressBar) progressBar.style.width = '0%';
        }, 300);
    }, 200);
}

/**
 * Update loading progress
 */
function updateProgress(percent) {
    if (progressBar) {
        progressBar.style.width = `${Math.min(Math.max(percent, 0), 100)}%`;
    }
}

/**
 * Preload initial batch of images with progress tracking
 */
async function preloadInitialImages() {
    // Preload maps first (they're small and needed for gameplay)
    const mapPromises = [];
    
    maps.forEach(mapName => {
        const mapPath = `assets/Minimaps/${mapName}_Minimap_Overlay.png`;
        if (!imageCache[mapPath]) {
            const promise = new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    imageCache[mapPath] = true;
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to preload map: ${mapPath}`);
                    resolve();
                };
                img.src = mapPath;
            });
            mapPromises.push(promise);
        }
    });
    
    // Wait for maps to load
    await Promise.all(mapPromises);
    
    // Then preload game images
    const imagePromises = [];
    const preloadCount = Math.min(5, flattenedImages.length);
    
    for (let i = 0; i < preloadCount; i++) {
        const imgData = flattenedImages[i];
        const imagePath = `assets/${imgData.map}Images/${imgData.imageData.name}.jpg`;
        
        // Skip if already cached
        if (imageCache[imagePath]) {
            imagesPreloaded++;
            updateProgress((imagesPreloaded / totalImagesToPreload) * 100);
            continue;
        }
        
        // Preload with promise
        const promise = new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                imageCache[imagePath] = true;
                imagesPreloaded++;
                updateProgress((imagesPreloaded / totalImagesToPreload) * 100);
                resolve();
            };
            img.onerror = () => {
                console.error(`Failed to preload image: ${imagePath}`);
                imagesPreloaded++;
                updateProgress((imagesPreloaded / totalImagesToPreload) * 100);
                resolve();
            };
            img.src = imagePath;
        });
        
        imagePromises.push(promise);
    }
    
    // Wait for initial images to load
    await Promise.all(imagePromises);
}

/**
 * Preload the next batch of images in the background
 */
function preloadNextBatchOfImages() {
    const preloadCount = 3;
    const endIdx = Math.min(preloadCount, flattenedImages.length);
    
    for (let i = 0; i < endIdx; i++) {
        const imgData = flattenedImages[i];
        const imagePath = `assets/${imgData.map}Images/${imgData.imageData.name}.jpg`;
        
        // Skip if already cached
        if (imageCache[imagePath]) continue;
        
        // Preload in background
        const img = new Image();
        img.onload = () => {
            imageCache[imagePath] = true;
        };
        img.src = imagePath;
    }
}