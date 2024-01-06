import React, { useEffect, useRef, useState } from "react";

export default function Canvas() {

    // REFS
    const canvasRef = useRef(null);    
    const angle = useRef(0);

    // STATES
    const [animateHandler, setAnimateHandler] = useState(false);
    const [randomRectValues, setRandomRectValues] = useState([]);

    // CANVAS WIDTH AND HEIGHT
    const screenWidth = window.innerWidth - 50;
    const screenHeight = window.innerHeight - 50;

    // COLORS
    const col1 = "rgb(255, 30, 40)";
    const col2 = "black";

    // DEG TO RADS
    function toRads(deg) {
        return (deg / (Math.PI / 180));
    }

    // RANDOM NUMBER
    function randomRange(min, max) {
        return Math.round(min + (Math.random() * (max - min)))
    }

    // CREATE RANDOM
    function getRandomElements(quantity) {
        let thisRandoms = [];
        for(let i = 0; i < quantity; i++) {
            const thisValues = {
                x: screenWidth * (randomRange(1 , 1000) / 1000),
                y: screenHeight * (randomRange(1, 1000) / 1000),
                width: screenWidth * (randomRange(1, 10) / 10),
                height: screenHeight * (randomRange(1, 10) / 10),
                //color: randomColor[randomRange(0,3)]
                color: "rgb(220" + "," + randomRange(0,255) + "," + randomRange(0,255) + ")"
            };

            thisRandoms.push(thisValues);
            //console.log(randomRange(0,10))
        };

        return thisRandoms;
    }


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

        console.log(angle.current)
        // animation function
        function render() { 

            // ANIMATION ON/OFF
            if(animateHandler === true) {
                timerHolder = window.requestAnimationFrame(render);
            } else{
                timerHolder = null;
            }

            function drawing() {
                // CLEARE CANVAS AFTER EACH RENDER
                context.clearRect(0, 0, width, height);

                // UPDATING ANGLE
                angle.current += toRads(0.0001);


                // RENDER RANDOM RECTS
                randomRectValues[0]?.forEach(e => {
                    drawRect(
                        context, 
                        e.x,    // X
                        e.y,   // Y
                        25,    // WIDTH
                        25,   // HEIGHT
                        angle.current,  // ANGLE
                        //e.color
                        col1
                    );
                });

                randomRectValues[1]?.forEach(e => {
                    drawRect(
                        context, 
                        e.x,    // X
                        e.y,   // Y
                        35,    // WIDTH
                        35,   // HEIGHT
                        angle.current + 0.5,  // ANGLE
                        //e.color
                        col2
                    );
                })
            }
            drawing()
        };
        render();

        //animation cancel
        return () => cancelAnimationFrame(timerHolder);
    });


    // CREATE RANDOM PARAMETERS
    useEffect(() => {
        setRandomRectValues([
            getRandomElements(700),
            getRandomElements(500)
        ]);
    }, [])



    // DRAW RECTANGLE FUNCTION
    function drawRect(context, x, y, w, h, angle, color) {

        context.save();
        context.translate(x, y);

        const rx = Math.cos(angle) * w;
        const ry = Math.sin(angle) * w;

        context.strokeStyle = "black";
        context.fillStyle = color;
        context.lineWidth = 3;

        context.translate(rx * -0.5, (ry + h) * -0.5);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(rx, ry);
        context.lineTo(rx, ry + h);
        context.lineTo(0, h);

        context.closePath();

        context.fill();
        //context.stroke();
        context.restore();
    }



    return (
        <div 
        style={{
            width: "100%",
            height: "100vh",
            //background: "pink",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>

            <button 
            onClick={() => setAnimateHandler(!animateHandler)}
            >animation on/off</button>
            <canvas id="canvas" ref={canvasRef} height={screenHeight} width={screenWidth} style={{background: "black"}} />
        </div>
    )
}
