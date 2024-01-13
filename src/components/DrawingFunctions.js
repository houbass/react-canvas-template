


// DRAW LINES
export function drawLine(context, x, y ) {
    context.save();
    context.translate(x, y);
    context.strokeStyle = "black";
    //context.fillStyle = black;
    context.lineWidth = 3;
    context.beginPath();

    context.moveTo(0, 0);
    context.lineTo(100, 0);

    context.closePath();
    context.globalAlpha = 1;
    //context.fill();
    context.stroke();
    context.restore();
}

export function bezierCurve(context, start, cp1, cp2, end, opacity) {

    //console.log(start)

    context.save();

    // Cubic Bézier curve
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    context.globalAlpha = opacity;
    context.stroke();
    context.restore();

    /*
    // Start and end points
    context.fillStyle = "blue";
    context.beginPath();
    context.arc(start.x, start.y, 5, 0, 2 * Math.PI); // Start point
    context.arc(end.x, end.y, 5, 0, 2 * Math.PI); // End point
    context.fill();

    // Control points
    context.fillStyle = "red";
    context.beginPath();
    context.arc(cp1.x, cp1.y, 5, 0, 2 * Math.PI); // Control point one
    context.arc(cp2.x, cp2.y, 5, 0, 2 * Math.PI); // Control point two
    context.fill();
    */
}