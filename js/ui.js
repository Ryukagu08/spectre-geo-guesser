// Changes the displayed image with loading state management
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


// Updates the result message with appropriate styling and adjusts font size if needed

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
    
    // Adjust font size based on content length
    adjustResultFontSize(element_result, message);
};


// Adjusts font size based on text length

function adjustResultFontSize(element, message) {
    // Reset font size first
    element.style.fontSize = '';
    
    // Get the computed style to read the default font size
    const style = window.getComputedStyle(element);
    const defaultFontSize = parseFloat(style.fontSize);
    
    // If message is long, reduce the font size
    if (message.length > 30) {
        const sizeFactor = Math.min(1, 30 / message.length);
        const newSize = Math.max(defaultFontSize * sizeFactor, defaultFontSize * 0.6);
        element.style.fontSize = `${newSize}px`;
    }
}


// Toggles visibility of one or more elements

export const toggleVisibility = (isVisible, ...elementIds) => {
    elementIds.forEach((id) => {
        const element = document.querySelector(`#${id}`);
        if (element) {
            element.style.visibility = isVisible ? "visible" : "hidden";
        }
    });
}


// Removes the highlight from all map buttons

export const clearMapHighlight = () => {
    document.querySelectorAll(".map-btn").forEach(button => {
        button.classList.remove("correct-map");
    });
}