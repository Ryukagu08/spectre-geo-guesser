
// Change the displayed image
export const changeImage = (data) => {
    document.querySelector("#geo-image").src = `assets/${data.map}Images/${data.imageData.name}.jpg`;
}

export const updateResult = (message, color) => {
    const element_result = document.querySelector("#result");
    element_result.innerHTML = message;

    switch (color){
        case "green":
            element_result.className = "result-correct";

        case "red":
            element_result.className = "result-incorrect";

        default:
            element_result.className = "";
    }
};

export const toggleVisibility = (isVisible, ...elementIds) => {
    elementIds.forEach((id) => {
        const element = document.querySelector(`#${id}`);

        if (element) {
            element.style.visibility = isVisible ? "visible" : "hidden";
        } else {
            console.error(`Element with ID "${id}" not found.`);
        }
    });
    //document.querySelector("#clickable-image").style.visibility;
    //document.querySelector("#dot").style.visibility;
    

    //imageElement.style.visibility = isVisible ? "visible" : "hidden";
    //dotElement.style.visibility = isVisible ? "visible" : "hidden";
}

// Remove the highlight from all map buttons
export const clearMapHighlight = () => {
    document.querySelectorAll(".map-btn").forEach(button => {
        button.classList.remove("correct-map");
    });
}