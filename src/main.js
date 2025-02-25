
//variables
let knowsAnswer = false;

// data array
let flattenedImages = [];
let currentImageData;

// 
let x;
let y;
let cords = {};
let distanceX = 0;
let distanceY = 0;

//
let maps = ["Mill", "Skyway", "Metro", "Commons", "Canal"]
let mapCheck = "Null";

// 
const element_result = document.querySelector("#result");
const element_dot = document.querySelector("#dot");
const element_map_name = document.querySelector("#map-name");


let jsonData = null;


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
    })
    .catch(error => console.error("Error loading JSON:", error));
};


//event listeners 

// place dot on click
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#clickable-image").addEventListener("click", function(event) {
        let inputedCords = getCoordinates(event);
        cords.x = inputedCords.x;
        cords.y = inputedCords.y;
        
        if (!element_dot) {
            console.error("Element not found!");
            return;
        }

        element_dot.style.left = cords.x + "px";
        element_dot.style.top = cords.y + "px";
    });
});

//btn event listeners

document.querySelector("#btn-submit").addEventListener("click", function() {
    submitted(cords.x,cords.y,currentImageData);
});

document.querySelector("#btn-continue").addEventListener("click", function() {
    if (!knowsAnswer){
        element_result.innerHTML = "You don't know the answer, would you still like to continue? (after yes hit continue again)";
        document.getElementById("btn-yes").style.visibility = "visible";
        document.getElementById("btn-no").style.visibility = "visible";        
        return;
    }
    console.log(flattenedImages.length);
    if (flattenedImages.length == 0)
    {
        element_result.innerHTML = "Thats the last image! Hope you had fun.";
        return;
    }
    getRandomImage();
    
    knowsAnswer = false;

    document.getElementById("btn-yes").style.visibility = "hidden";
    document.getElementById("btn-no").style.visibility = "hidden";  

    document.querySelector("#clickable-image").style.visibility = "hidden";
    document.querySelector("#dot").style.visibility = "hidden";
    mapCheck = "Clear";


    element_result.innerHTML = "Where is this image?";
    element_map_name.innerHTML = "&nbsp;"
});

document.querySelector("#btn-map").addEventListener("click", function() 
{
    element_map_name.innerHTML = `${currentImageData.map}`;
    document.querySelector("#clickable-image").src = `assets/Minimaps/${currentImageData.map}_Minimap_Overlay.png`;
    mapCheck = currentImageData.map;
});

document.querySelector("#btn-answer").addEventListener("click", function() {

    element_dot.style.left = currentImageData.imageData.cords.x + "px";
    element_dot.style.top = currentImageData.imageData.cords.y + "px";

    knowsAnswer = true;
});

document.querySelector("#btn-clear").addEventListener("click", function() {
    document.querySelector("#clickable-image").style.visibility = "hidden";
    document.querySelector("#dot").style.visibility = "hidden";
    mapCheck = "Clear";
});

document.querySelector("#btn-mill").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Mill_Minimap_Overlay.png";
    mapCheck = "Mill";
});

document.querySelector("#btn-metro").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Metro_Minimap_Overlay.png";
    mapCheck = "Metro";
});

document.querySelector("#btn-skyway").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Skyway_Minimap_Overlay.png";
    mapCheck = "Skyway";
});

document.querySelector("#btn-commons").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Commons_Minimap_Overlay.png";
    mapCheck = "Commons";
});

document.querySelector("#btn-canal").addEventListener("click", function() {
    document.querySelector("#clickable-image").src = "assets/Minimaps/Canal_Minimap_Overlay.png";
    mapCheck = "Canal";
});

document.querySelectorAll(".map-btn").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelector("#clickable-image").style.visibility = "visible";
        document.querySelector("#dot").style.visibility = "visible";
    });
});

document.querySelector("#btn-yes").addEventListener("click", function() {
    knowsAnswer = true;
});


//helper functions
const createDataArray = () => {
    // randomize data into an array
    for (let map in jsonData.Maps) {
        for (let imageKey in jsonData.Maps[map]) {
            flattenedImages.push({ map, imageKey, imageData: jsonData.Maps[map][imageKey] });
        }
    }
    shuffleArray(flattenedImages);
}

const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

const getRandomImage = () => {
    currentImageData = flattenedImages.shift()
    changeImage(currentImageData);
}

const changeImage = (data) => {
    document.querySelector("#geo-image").src = `assets/${data.map}Images/${data.imageData.name}.jpg`;
}

const getCoordinates = (event) => {
    const img = event.target;
    const rect = img.getBoundingClientRect();

    x = event.clientX - rect.left;
    y = event.clientY - rect.top;

    x = Math.round(x);
    y = Math.round(y);

    return {x,y}
}

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
            knowsAnswer = true;
        }
        else
        {
            element_result.innerHTML = 'not quite right';
        }
    }
    else{
        element_result.innerHTML = 'wrong map';
    }
    
}
