/**
 * UI utility functions for Spectre Divide Geoguessr
 */

/**
 * Changes the displayed image with loading state management
 */
export const changeImage = (data) => {
    const imageElement = document.querySelector("#geo-image");
    const quizImageContainer = document.querySelector(".quiz-image");
    
    // Set the image source
    imageElement.src = `assets/${data.map}Images/${data.imageData.name}.jpg`;
    
    // Handle image loading events
    imageElement.onload = () => {
        quizImageContainer.classList.remove("is-loading");
    };
    
    imageElement.onerror = () => {
        quizImageContainer.classList.remove("is-loading");
        updateResult("Error loading image", "red");
    };
}

/**
 * Updates the result message with appropriate styling
 */
export const updateResult = (message, color) => {
    const element_result = document.querySelector("#result");
    element_result.innerHTML = message;

    // Apply appropriate class based on result type
    element_result.className = "";
    if (color === "green") {
        element_result.className = "result-correct";
    } else if (color === "red") {
        element_result.className = "result-incorrect";
    }
};

/**
 * Toggles visibility of one or more elements
 */
export const toggleVisibility = (isVisible, ...elementIds) => {
    elementIds.forEach((id) => {
        const element = document.querySelector(`#${id}`);
        if (element) {
            element.style.visibility = isVisible ? "visible" : "hidden";
        }
    });
}

/**
 * Removes the highlight from all map buttons
 */
export const clearMapHighlight = () => {
    document.querySelectorAll(".map-btn").forEach(button => {
        button.classList.remove("correct-map");
    });
}