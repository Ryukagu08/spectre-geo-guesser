//variables
let knowsAnswer = false;

// data array
let flattenedImages = [];
let currentImageData;

// coordinate variables
let x;
let y;
let cords = {};
let distanceX = 0;
let distanceY = 0;

// map information
let maps = ["Mill", "Skyway", "Metro", "Commons", "Canal"]
let mapCheck = "Null";

// DOM elements
const element_result = document.querySelector("#result");
const element_dot = document.querySelector("#dot");
const element_map_name = document.querySelector("#map-name");

// data storage
let jsonData = null;

// Load JSON data on window load
window.onload = () => {
    fetch("data/data.json")
    .then(response => response.json())
    .then(data => {
        jsonData = data; 
        console.log("JSON Data Loaded:", jsonData); 
        createDataArray();
        
        // Replace image with the first one in the data array
        if (flattenedImages.length > 0) {
            currentImageData = flattenedImages.shift();
            changeImage(currentImageData);
        }
        
        // Ensure confirmation buttons are hidden on initial load
        document.getElementById("btn-yes").style.visibility = "hidden";
        document.getElementById("btn-no").style.visibility = "hidden";
    })
    .catch(error => console.error("Error loading JSON:", error));
};

// Function to update dot position when screen size changes
function updateDotPosition() {
    if (element_dot && element_dot.style.visibility === 'visible' && cords.x && cords.y) {
        // Get the current quiz image container dimensions
        const quizImage = document.querySelector('.quiz-image');
        const scaleFactor = quizImage.clientWidth / 720;
        
        // Update dot position with the current scale factor
        element_dot.style.left = `${cords.x * scaleFactor}px`;
        element_dot.style.top = `${cords.y * scaleFactor}px`;
    }
}

//event listeners 

// place dot on click
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#clickable-image").addEventListener("click", function(event) {
        // Scale coordinates back to original image size
        const scaleX = 720 / event.target.clientWidth;
        const scaleY = 720 / event.target.clientHeight;
        
        let inputedCords = getCoordinates(event);
        
        cords.x = Math.round(inputedCords.x * scaleX);
        cords.y = Math.round(inputedCords.y * scaleY);
        
        if (!element_dot) {
            console.error("Element not found!");
            return;
        }

        // Get current quiz image size for dynamic scaling
        const quizImageWidth = document.querySelector('.quiz-image').clientWidth;
        const scaleFactor = quizImageWidth / 720;
        
        // Position using absolute pixel values with proper scaling
        element_dot.style.left = `${cords.x * scaleFactor}px`;
        element_dot.style.top = `${cords.y * scaleFactor}px`;
        element_dot.style.visibility = 'visible';
    });
    
    // Add window resize listener to adjust dot position
    window.addEventListener('resize', updateDotPosition);
});

//btn event listeners

// Submit button - check if coordinates are correct
document.querySelector("#btn-submit").addEventListener("click", function() {
    submitted(cords.x,cords.y,currentImageData);
});

// Continue/Next button - load next image
document.querySelector("#btn-continue").addEventListener("click", function() {
    if (!knowsAnswer){
        element_result.innerHTML = "You don't know the answer, would you still like to continue?";
        element_result.className = ""; // Reset result class
        document.getElementById("btn-yes").style.visibility = "visible";
        document.getElementById("btn-no").style.visibility = "visible";        
        return;
    }
    console.log(flattenedImages.length);
    if (flattenedImages.length == 0)
    {
        element_result.innerHTML = "Thats the last image! Hope you had fun.";
        element_result.className = ""; // Reset result class
        return;
    }
    getRandomImage();
    
    knowsAnswer = false;

    document.getElementById("btn-yes").style.visibility = "hidden";
    document.getElementById("btn-no").style.visibility = "hidden";  

    document.querySelector("#clickable-image").style.visibility = "hidden";
    document.querySelector("#dot").style.visibility = "hidden";
    mapCheck = "Clear";
    
    // Clear any map highlight when moving to next image
    clearMapHighlight();

    element_result.innerHTML = "Where is this image?";
    element_result.className = ""; // Reset result class
    element_map_name.innerHTML = "&nbsp;"
});

// Get map button - show correct map and highlight it
document.querySelector("#btn-map").addEventListener("click", function() 
{
    // Clear any previous highlight
    clearMapHighlight();
    
    // Highlight the correct map button
    const mapButtonId = `btn-${currentImageData.map.toLowerCase()}`;
    document.getElementById(mapButtonId).classList.add("correct-map");
    
    // Show the map
    document.querySelector("#clickable-image").src = `assets/Minimaps/${currentImageData.map}_Minimap_Overlay.png`;
    mapCheck = currentImageData.map;
});

// Get answer button - show the correct spot
document.querySelector("#btn-answer").addEventListener("click", function() {
    const dotElement = element_dot;
    
    // Get current quiz image size for dynamic scaling
    const quizImageWidth = document.querySelector('.quiz-image').clientWidth;
    const scaleFactor = quizImageWidth / 720;
    
    // Store the coordinates for later reference
    cords.x = currentImageData.imageData.cords.x;
    cords.y = currentImageData.imageData.cords.y;
    
    // Position using absolute pixel values with proper scaling
    dotElement.style.left = `${cords.x * scaleFactor}px`;
    dotElement.style.top = `${cords.y * scaleFactor}px`;
    
    dotElement.style.visibility = 'visible';

    knowsAnswer = true;
});

// Clear button - hide the map and dot
document.querySelector("#btn-clear").addEventListener("click", function() {
    document.querySelector("#clickable-image").style.visibility = "hidden";
    document.querySelector("#dot").style.visibility = "hidden";
    mapCheck = "Clear";
    clearMapHighlight();
});

// Map selection buttons
document.querySelector("#btn-mill").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Mill_Minimap_Overlay.png";
    mapCheck = "Mill";
    clearMapHighlight();
});

document.querySelector("#btn-metro").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Metro_Minimap_Overlay.png";
    mapCheck = "Metro";
    clearMapHighlight();
});

document.querySelector("#btn-skyway").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Skyway_Minimap_Overlay.png";
    mapCheck = "Skyway";
    clearMapHighlight();
});

document.querySelector("#btn-commons").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Commons_Minimap_Overlay.png";
    mapCheck = "Commons";
    clearMapHighlight();
});

document.querySelector("#btn-canal").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Canal_Minimap_Overlay.png";
    mapCheck = "Canal";
    clearMapHighlight();
});

// Show the map and dot when any map button is clicked
document.querySelectorAll(".map-btn").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelector("#clickable-image").style.visibility = "visible";
        document.querySelector("#dot").style.visibility = "visible";
    });
});

// Yes confirmation button - proceed to next image
document.querySelector("#btn-yes").addEventListener("click", function() {
    knowsAnswer = true;
    
    // Add continue functionality directly here
    if (flattenedImages.length == 0) {
        element_result.innerHTML = "Thats the last image! Hope you had fun.";
        element_result.className = ""; // Reset result class
        return;
    }
    getRandomImage();
    
    knowsAnswer = false; // Reset for new image

    document.getElementById("btn-yes").style.visibility = "hidden";
    document.getElementById("btn-no").style.visibility = "hidden";  

    document.querySelector("#clickable-image").style.visibility = "hidden";
    document.querySelector("#dot").style.visibility = "hidden";
    mapCheck = "Clear";
    
    // Clear any map highlight when moving to next image
    clearMapHighlight();

    element_result.innerHTML = "Where is this image?";
    element_result.className = ""; // Reset result class
    element_map_name.innerHTML = "&nbsp;";
});

// No confirmation button - stay on current image
document.querySelector("#btn-no").addEventListener("click", function() {
    // Hide the confirmation buttons since user doesn't want to continue
    document.getElementById("btn-yes").style.visibility = "hidden";
    document.getElementById("btn-no").style.visibility = "hidden";
    
    // Update the result text to provide clarity
    element_result.innerHTML = "Continue when you're ready.";
    element_result.className = ""; // Reset result class
});

// Helper functions

// Create and randomize the array of images
const createDataArray = () => {
    for (let map in jsonData.Maps) {
        for (let imageKey in jsonData.Maps[map]) {
            flattenedImages.push({ map, imageKey, imageData: jsonData.Maps[map][imageKey] });
        }
    }
    shuffleArray(flattenedImages);
}

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Get the next image from the array
const getRandomImage = () => {
    currentImageData = flattenedImages.shift()
    changeImage(currentImageData);
}

// Remove the highlight from all map buttons
const clearMapHighlight = () => {
    document.querySelectorAll(".map-btn").forEach(button => {
        button.classList.remove("correct-map");
    });
}

// Change the displayed image
const changeImage = (data) => {
    document.querySelector("#geo-image").src = `assets/${data.map}Images/${data.imageData.name}.jpg`;
}

// Get the coordinates from a click event
const getCoordinates = (event) => {
    const img = event.target;
    const rect = img.getBoundingClientRect();

    x = event.clientX - rect.left;
    y = event.clientY - rect.top;

    x = Math.round(x);
    y = Math.round(y);

    return {x,y}
}

// Check if the submitted guess is correct
const submitted = (x,y,currentImageData) => {
    if (!jsonData) {  
        console.error("JSON data is not loaded yet!");
        return;
    }

    distanceX = Math.abs(x-currentImageData.imageData.cords.x);
    distanceY = Math.abs(y-currentImageData.imageData.cords.y);

    if (mapCheck == currentImageData.map){
        if (distanceX < 10 && distanceY < 15){
            element_result.innerHTML = 'You got it right!';
            element_result.className = 'result-correct'; // Add green text class
            knowsAnswer = true;
        }
        else
        {
            element_result.innerHTML = 'Not quite right';
            element_result.className = 'result-incorrect'; // Add red text class
        }
    }
    else{
        element_result.innerHTML = 'Wrong map';
        element_result.className = 'result-incorrect'; // Add red text class
    }
}