import React, { useEffect, useRef, useState } from "react";

//CANVAS SKETCH FUNKCE
const random = require ('canvas-sketch-util/random');

export default function Canvas({ canvasRef, canvasSize, recHandler, images, animateHandler, drawHandler, presset, reset }) {

    // REFS 
    const angle = useRef(0);

    // STATES
    const [xShift, setXShift] = useState(0);
    const [yShift, setYShift] = useState(700);

    // PATTERN INPUTS
    const canvasColor = "rgb(255, 120, 90)";

    const horizontY = 650;
    const horizontX = 500;

    let rectX;
    let rectY;
    const rectLength = 200;


    //ANIMATION IS RUNING HERE
    useEffect(() => {

        // canvas def
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Animation handler (zabranuje aby se animace zrychlovala po kazdem updatu)
        let timerHolder = null;

        // canvas settings
        const width = canvas.width;
        const height = canvas.height;


        // animation function
        function render() { 

            // ANIMATION ON/OFF
            if(animateHandler === true) {
                timerHolder = window.requestAnimationFrame(render);
            } else{
                timerHolder = null;
            }

            // RECORDING
            function imgCapture() {
                if(recHandler === true) {
                    images.current=([
                        ...images.current, canvas.toDataURL("image/png", 1.0)
                    ])
                }
            }
            imgCapture()

            // DRAWING
            function drawing() {
                // DRAWING FUNCTION
                if(drawHandler === true) {
                    
                } else{
                    context.clearRect(0, 0, width, height);
                    context.fillStyle = canvasColor;
                    context.fillRect(0, 0, width, height);
                }
                
                // UPDATING ANGLE
                angle.current += 0.01;   
                rectX = xShift
                rectY = yShift;
                //console.log(xShift)

                //const yMotion = random.noise1D(angle.current, 1, 5)
                //rectY += yMotion;

                // PRVNI STRANA
                const xDelta = horizontX - (rectX + rectLength);
                const yDelta = horizontY - rectY;

                const odvesna = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
                const sin = xDelta / odvesna;
                const cos = yDelta / odvesna;
                const tan = yDelta / xDelta;
                const prepona = sin * rectLength

                // first point
                const yDelta2 = horizontY - (rectY + rectLength);
                const odvesna2 = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta2, 2));
                const sin2 = xDelta / odvesna2;
                const cos2 = yDelta2 / odvesna2;
                const finalX = sin2 * prepona;
                const finalY = cos2 * prepona;


                // second point
                const xDelta2 = finalX;
                const finalY2 = xDelta2 * tan;



                // HORNI STRANA
                const xDelta3 = horizontX - rectX;
                const yDelta3 = horizontY - rectY;
                const tan2 = xDelta3 / yDelta3;
                const yDelta4 = rectY + finalY2 - horizontY;
                const finalX3 = tan2 * yDelta4;


                // SPODNI STRANA
                const tan3 = xDelta3 / yDelta2;
                const finalX4 = tan3 * (finalY + rectY + rectLength - horizontY)

                // 4th point
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(finalX4 + horizontX, rectY + rectLength + finalY, 5, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                context.restore();

                //SIDE 3
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(rectX , rectY + rectLength);
                context.lineTo(finalX4 + horizontX, rectY + rectLength + finalY);
                context.lineTo(rectX + rectLength + finalX, rectY + rectLength + finalY);
                context.lineTo(rectX + rectLength, rectY + rectLength);
                context.closePath();
                context.globalAlpha = 0.5;
                context.fill();
                context.stroke();
                context.restore();



                context.save();
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(finalX4 + horizontX, rectY + rectLength + finalY);
                context.lineTo(horizontX + finalX3, rectY + finalY2);
                context.stroke();
                context.restore();


                // 3rd point
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(horizontX + finalX3, rectY + finalY2, 5, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                context.restore();

                //SIDE 2
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(rectX , rectY);
                context.lineTo(horizontX + finalX3, rectY + finalY2);
                context.lineTo(rectX + rectLength + finalX, rectY + finalY2);
                context.lineTo(rectX + rectLength, rectY);
                context.closePath();
                context.globalAlpha = 0.5;
                context.fill();
                context.stroke();
                context.restore();


                // 2nd point
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(rectX + rectLength + finalX, rectY + finalY2, 5, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                context.restore();

                
                // 1st point
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(rectX + rectLength + finalX, rectY + rectLength + finalY, 5, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                context.restore();




                //SIDE 1
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(rectX + rectLength, rectY + rectLength);
                context.lineTo(rectX + rectLength + finalX, rectY + rectLength + finalY);
                context.lineTo(rectX + rectLength + finalX, rectY + finalY2);
                context.lineTo(rectX + rectLength, rectY);
                context.closePath();
                context.globalAlpha = 0.5;
                context.fill();
                context.stroke();
                context.restore();


                

                // finding angle
                // RECT POINT 1
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(rectX, rectY, 5, 0, 2 * Math.PI);
                context.moveTo(rectX, rectY);
                context.lineTo(horizontX, horizontY);
                context.fill();
                context.stroke();
                context.restore();

                // RECT POINT 2
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(rectX + rectLength, rectY, 5, 0, 2 * Math.PI);
                context.moveTo(rectX + rectLength, rectY);
                context.lineTo(horizontX, horizontY);
                context.fill();
                context.stroke();
                context.restore();

                // RECT POINT 3
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(rectX + rectLength, rectY + rectLength, 5, 0, 2 * Math.PI);
                context.moveTo(rectX + rectLength, rectY + rectLength);
                context.lineTo(horizontX, horizontY);
                context.fill();
                context.stroke();
                context.restore();

                // RECT POINT 4
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(rectX, rectY + rectLength, 5, 0, 2 * Math.PI);
                context.moveTo(rectX, rectY + rectLength);
                context.lineTo(horizontX, horizontY);
                context.fill();
                context.stroke();
                context.restore();



                // SQUARE
                context.save();
                context.lineWidth = 3;
                context.beginPath();
                context.fillStyle = "white";
                context.moveTo(rectX, rectY);
                context.lineTo(rectX + rectLength, rectY);
                context.lineTo(rectX + rectLength, rectY + rectLength);
                context.lineTo(rectX, rectY + rectLength);
                context.closePath();
                context.globalAlpha = 0.5;
                context.fill();
                context.stroke();
                context.restore();



                // HORIZONT LINE
                context.save();
                context.strokeStyle = "white";
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(0, horizontY);
                context.lineTo(1000, horizontY);
                context.stroke();
                context.restore();

                // HORIZONT POINT
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 3;
                context.beginPath();
                context.arc(horizontX, horizontY, 10, 0, 2 * Math.PI);
                context.fill();
                context.restore();
                                                
            }
            drawing();
        };
        render();

        //animation cancel when re-render component
        return () => cancelAnimationFrame(timerHolder);
    });





    return (
        <div 
        style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",           
        }}>
            <div 
            style={{
                display: "inline-flex",
                gap: "10px",
                color: "white",
                paddingBottom: "10px"
            }}>
                <p>x shift</p>
                <input type="range" min={0} max={300} step={1} defaultValue={0} onChange={(e) => setXShift(Number(e.target.value))} ></input>
            </div>

            <div 
            style={{
                display: "inline-flex",
                gap: "10px",
                color: "white",
                paddingBottom: "10px"
            }}>
                <p>y shift</p>
                <input type="range" min={0} max={1000} step={1} defaultValue={700} onChange={(e) => setYShift(Number(e.target.value))} ></input>
            </div>

            <canvas id="canvas" ref={canvasRef} height={canvasSize} width={canvasSize} style={{background: canvasColor}} />
        </div>
    )
}
