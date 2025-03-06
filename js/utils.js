export let x;
export let y;

// Shuffles an array using Fisher-Yates algorithm

export const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Gets the coordinates from a click event

export const getCoordinates = (event) => {
    const img = event.target;
    const rect = img.getBoundingClientRect();

    x = Math.round(event.clientX - rect.left);
    y = Math.round(event.clientY - rect.top);

    return {x, y};
}