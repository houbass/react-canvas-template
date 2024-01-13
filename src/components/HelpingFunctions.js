

// DEG TO RADS
export function toRads(deg) {
    return deg * (Math.PI / 180);
}

// RANDOM NUMBER
export function randomRange(min, max) {
    return Math.round(min + (Math.random() * (max - min)))
}