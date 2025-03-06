import { currentImageData, flattenedImages, getRandomImage } from "./data.js";
import { getCoordinates, x, y } from "./utils.js";
import { toggleVisibility, updateResult, clearMapHighlight } from "./ui.js";

export let knowsAnswer = false;

let mapCheck = "Null"
const maps = ["Mill", "Metro", "Skyway", "Commons", "Canal"];

const element_dot = document.querySelector("#dot");

let distanceX = 0;
let distanceY = 0;


// coordinate variables

let cords = {};

export const setupEventListeners = () => {
    // Submit button - check if coordinates are correct
    document.querySelector("#btn-submit").addEventListener("click", function() {
        submitted(cords.x,cords.y,currentImageData,mapCheck);
    });

    // Continue/Next button - load next image
    document.querySelector("#btn-continue").addEventListener("click", function() {
        handlesContinue();
    });

    // Get map button - show correct map and highlight it
    document.querySelector("#btn-map").addEventListener("click", function() 
    {
        highlightCorrectMap();
    });

    document.querySelector("#btn-answer").addEventListener("click", function() 
    {
        showCorrectAnswer();
    });

    // Clear button - hide the map and dot
    document.querySelector("#btn-clear").addEventListener("click", function() {
        toggleVisibility(false, "clickable-image", "dot");
        mapCheck = "Clear";
        clearMapHighlight();
    });

    setUpMapButtons ();

    // Yes confirmation button - proceed to next image
    document.querySelector("#btn-yes").addEventListener("click", function() {
        knowsAnswer = true;
        handlesContinue();
    });
    
    // No confirmation button - stay on current image
    document.querySelector("#btn-no").addEventListener("click", function() {
        // Hide the confirmation buttons since user doesn't want to continue
        //document.getElementById("btn-yes").style.visibility = "hidden";
        //document.getElementById("btn-no").style.visibility = "hidden";
        toggleVisibility(false, "btn-yes", "btn-no");
        
        // Update the result text to provide clarity
        updateResult("Continue when you're ready.", 'default');
    });

    document.querySelector("#clickable-image").addEventListener("click", function(event) {
        placeDot();
    });
}

const setUpMapButtons = () => {
    maps.forEach((mapName) => {
        document.querySelector(`#btn-${mapName.toLowerCase()}`).addEventListener("click", function () {
            document.querySelector("#clickable-image").src = `assets/Minimaps/${mapName}_Minimap_Overlay.png`;
            mapCheck = mapName;
            clearMapHighlight();
            // Show the map and dot for this map
            toggleVisibility(true, "clickable-image", "dot");
        });
    });

    document.querySelectorAll(".map-btn").forEach(button => {
        button.addEventListener("click", function() {
            toggleVisibility(true, "clickable-image", "dot");
        });
    });
};

// Check if the submitted guess is correct
const submitted = (x,y,currentImageData, mapCheck) => {

    distanceX = Math.abs(x-currentImageData.imageData.cords.x);
    distanceY = Math.abs(y-currentImageData.imageData.cords.y);

    if (mapCheck == currentImageData.map){
        if (distanceX < 10 && distanceY < 15){
            updateResult('You got it right!', 'green'); // green adds green text class
            knowsAnswer = true;
        }
        else
        {
            updateResult('Not quite right', 'red'); // red adds red text class
        }
    }
    else{
        updateResult('Wrong map', 'red'); // red adds red text class
    }
}

const handlesContinue = () => {
    if (!knowsAnswer) {
        updateResult("You don't know the answer, would you still like to continue?", 'default');
        //document.getElementById("btn-yes").style.visibility = "visible";
        //document.getElementById("btn-no").style.visibility = "visible";
        toggleVisibility(true, "btn-yes", "btn-no");
        return;
    }
    if (flattenedImages.length == 0)
    {
        updateResult("Thats the last image! Hope you had fun.", 'default');
        return;
    }

    getRandomImage();
    knowsAnswer = false;
    
    //document.getElementById("btn-yes").style.visibility = "hidden";
    //document.getElementById("btn-no").style.visibility = "hidden";
    toggleVisibility(false, "btn-yes", "btn-no", "clickable-image", "dot");

    mapCheck = "Clear"
    clearMapHighlight();
    updateResult("Where is this image?", 'default');
}

const highlightCorrectMap = () => {
    clearMapHighlight();

    // Highlight the correct map button
    const mapButtonId = `btn-${currentImageData.map.toLowerCase()}`;
    document.getElementById(mapButtonId).classList.add("correct-map");
    
    // Show the map
    document.querySelector("#clickable-image").src = `assets/Minimaps/${currentImageData.map}_Minimap_Overlay.png`;
    mapCheck = currentImageData.map;
}

const showCorrectAnswer = () => {    
    // Get current quiz image size for dynamic scaling
    const quizImageWidth = document.querySelector('.quiz-image').clientWidth;
    const scaleFactor = quizImageWidth / 720;
    
    // Store the coordinates for later reference
    cords.x = currentImageData.imageData.cords.x;
    cords.y = currentImageData.imageData.cords.y;
    
    // Position using absolute pixel values with proper scaling
    element_dot.style.left = `${cords.x * scaleFactor}px`;
    element_dot.style.top = `${cords.y * scaleFactor}px`;
    
    element_dot.style.visibility = 'visible';

    knowsAnswer = true;
}

const placeDot = () => {
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

    // Add window resize listener to adjust dot position
    window.addEventListener('resize', updateDotPosition);
}

// Function to update dot position when screen size changes
const updateDotPosition = () => {
    if (element_dot && element_dot.style.visibility === 'visible' && cords.x && cords.y) {
        // Get the current quiz image container dimensions
        const quizImage = document.querySelector('.quiz-image');
        const scaleFactor = quizImage.clientWidth / 720;
        
        // Update dot position with the current scale factor
        element_dot.style.left = `${cords.x * scaleFactor}px`;
        element_dot.style.top = `${cords.y * scaleFactor}px`;
    }
}

/*

// btn-continue

    if (!knowsAnswer){
            element_result.innerHTML = "You don't know the answer, would you still like to continue?";
            element_result.className = ""; // Reset result class
            document.getElementById("btn-yes").style.visibility = "visible";
            document.getElementById("btn-no").style.visibility = "visible";        
            return;
        }
        //console.log(flattenedImages.length);
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


// btn-map

    // Clear any previous highlight
    clearMapHighlight();
    
    // Highlight the correct map button
    const mapButtonId = `btn-${currentImageData.map.toLowerCase()}`;
    document.getElementById(mapButtonId).classList.add("correct-map");
    
    // Show the map
    document.querySelector("#clickable-image").src = `assets/Minimaps/${currentImageData.map}_Minimap_Overlay.png`;
    mapCheck = currentImageData.map;


// btn-answer 

// Get answer button - show the correct spot
    document.querySelector("#btn-answer").addEventListener("click", function() {
    const dotElement = element_dot;
    
    // Set CSS variables for dot positioning
    dotElement.style.setProperty('--dot-x', currentImageData.imageData.cords.x);
    dotElement.style.setProperty('--dot-y', currentImageData.imageData.cords.y);
    
    dotElement.style.left = `calc(${currentImageData.imageData.cords.x} * ((520 / 720) * 1px))`;
    dotElement.style.top = `calc(${currentImageData.imageData.cords.y} * ((520 / 720) * 1px))`;
    
    dotElement.style.visibility = 'visible';

    knowsAnswer = true;
});


// btn-clear

// Clear button - hide the map and dot
    document.querySelector("#btn-clear").addEventListener("click", function() {
        document.querySelector("#clickable-image").style.visibility = "hidden";
        document.querySelector("#dot").style.visibility = "hidden";
        mapCheck = "Clear";
        clearMapHighlight();
    });

// maps

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


*/