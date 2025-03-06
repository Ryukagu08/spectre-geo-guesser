import { shuffleArray } from "./utils.js";
import { changeImage } from "./ui.js";

export let jsonData = null;
export let currentImageData = null;
export let flattenedImages = [];

/*
export const loadData = async () => {
    try {
        const response = await fetch("data/data.json");
        jsonData = await response.json();
        createDataArray();
        console.log("JSON Data Loaded:", jsonData); 
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
};
*/
export const loadData = async () => {
    try {
        const response = await fetch("data/data.json");
        jsonData = await response.json();
        console.log("Fetched JSON Data:", jsonData); // Log the raw JSON data

        createDataArray();  // Proceed with processing
        console.log("Array after processing:", flattenedImages); // Log the flattened images array
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
    getRandomImage();
};


// Create and randomize the array of images
const createDataArray = () => {
    for (let map in jsonData.Maps) {
        for (let imageKey in jsonData.Maps[map]) {
            flattenedImages.push({ map, imageKey, imageData: jsonData.Maps[map][imageKey] });
        }
    }
    shuffleArray(flattenedImages);
}

// Get the next image from the array
export let getRandomImage = () => {
    if (flattenedImages.length > 0) {
        currentImageData = flattenedImages.shift()
        changeImage(currentImageData);
    }
}