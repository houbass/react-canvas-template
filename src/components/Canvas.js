import React, { useEffect, useRef, useState } from "react";

//CANVAS SKETCH FUNKCE
const random = require ('canvas-sketch-util/random');

export default function Canvas({ canvasRef, canvasSize, setCanvasSize }) {

    // REFS 
    const angle = useRef(0);

    // STATES
    const [animateHandler, setAnimateHandler] = useState(true);
    const [drawHandler, setDrawHandler] = useState(false);
    const [presset, setPresset] = useState("normal");
    const [randomRectValues, setRandomRectValues] = useState([]);
    const [randomLineValues, setRandomLineValues] = useState([]);
    const [reset, setReset] = useState(true);

    // PATTERN INPUTS
    const canvasColor = "rgb(255, 120, 90)";
    const textColor = "white"

    // ORBITS SETTINGS
    const patternIputs = [
        {  
            quantity: 500,
            //color: "rgba( 225, 50, 40)",
            color: "rgb(25, 25, 25)",
            width: 80,
            height: 30
        }, 
    ];

    // LINES SETTINGS 
    const linesQuantity = 500;
    const linesYRange = [-220, 220];
    const linesColor = "rgb(225 , 225, 225)";
    const linesMaxLength = 150;
    const linesWeight = [0, 10];




    // DEG TO RADS
    function toRads(deg) {
        return (deg / (Math.PI / 180));
    }

    // RANDOM NUMBER
    function randomRange(min, max) {
        return Math.round(min + (Math.random() * (max - min)))
    }

    // CREATE RANDOM ORBITING ELEMENTS
    function getRandomElements(quantity, index, color, size, w, h ) {
        let thisRandoms = [];
        for(let i = 0; i < quantity + 100; i++) {
            const thisValues = {
                x: size / quantity * i - 50,
                //y: ((((size / 2) - 70) / quant) * shift) + (index * (size / quant)) + (((size / 2) - 35) / quant) ,
                width: randomRange(10, w),
                height: randomRange(10, h),
                color: color,
                opacity: String(Math.round(Math.random()))
            };
            thisRandoms.push(thisValues);
        };
        return thisRandoms;
    };


    function getRandomLines(width, quantity, color) {
        let thisRandoms = [];
        for(let i = 0; i < quantity; i++) {

            const randomY = randomRange(0, randomRange(linesYRange[0], linesYRange[1]));
            const randomX = randomRange(0, width);
            const randomLength = randomRange(5, linesMaxLength);

            const thisLine = {
                color: color,
                width: randomRange(linesWeight[0], linesWeight[1]),
                x1: randomX,
                y1: randomY,
                x2: randomX + randomLength,
                y2: randomY
            }
            thisRandoms.push(thisLine);
        }

        return thisRandoms;
    };



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
                angle.current += 0.0000002;                

                // ORBITING ELEMENTS BACK                
                orbitingEl(context, angle.current , "b", width, 0);
                     
                // MIDLE LINES
                drawLines(context, width, angle.current);
            
                // ORBITING ELEMENTS FRONT
                orbitingEl(context, angle.current , "f", width, 0);                                                    
            }
            drawing();
        };
        render();

        //animation cancel when re-render component
        return () => cancelAnimationFrame(timerHolder);
    });


    // CREATE RANDOM PARAMETERS
    useEffect(() => {
        resizeFun();
        angle.current = 0;
        // eslint-disable-next-line
    }, [reset])


    //RESIZE FUNCTION
    function resizeFun() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const compare = [width, height].sort((a, b) => a - b);
        const canSize = compare[0] * 0.9

        setCanvasSize(canSize);
        setRandomRectValues(
            patternIputs.map((e, i) => {
                return getRandomElements(e.quantity, i, e.color, canSize, e.width, e.height)
            })
        );
        setRandomLineValues(getRandomLines(width, linesQuantity, linesColor))
    };

    useEffect(() => { 
        window.addEventListener("resize", resizeFun);
        return () => {
            window.removeEventListener("resize", resizeFun);
        }
    });



    //ORBITING ELEMENTS (FRONTSIDE / BACKSIDE)
    function orbitingEl(context, loopMotion, position, width, yChange) {
        const quant = patternIputs.length;

        // FRONTSIDE ELEMENTS
        randomRectValues.forEach((i, index) => {                           
            let shift;
            i.forEach((e, indexx) => {                
                const prevShift = shift;
                
                switch(presset) {
                    case "normal":
                        shift = Math.sin(toRads(random.noise2D(indexx, 0, 0.001 + loopMotion))); 
                        break;
                    case "incoming":
                        shift = Math.sin(toRads(random.noise2D(indexx / loopMotion / 10000, 0, 0.00001 + loopMotion)));
                        break;
                    default:
                        shift = Math.sin(toRads(random.noise2D(indexx, 0, 0.00001 + loopMotion))); 
                        break;
                }

                const thisY = ((((width / 3) - 70 - yChange) / quant) * shift) + (index * (width / quant)) + (((width / 2) - 35) / quant);
                    
                let color;

                if(position === "b") {
                    if(prevShift > shift) {
                        color = "transparent"; 

                    } else{
                        color = e.color;        
                    }
                } else if(position === "f") {
                    if(prevShift > shift) {
                        color = e.color;  
                    } else{
                        color = "transparent";       
                    }
                } else {
                    color = "white";
                }
            
                drawRect(
                    context, 
                    e.x,    // X
                    thisY,   // Y
                    e.width,    // WIDTH
                    e.height,   // HEIGHT
                    //angle.current,  // ANGLE
                    //angle.current + (indexx / 1000),
                    0,
                    color,
                    e.opacity
                );

            });                                       
        });
    };





    // DRAW RECTANGLE FUNCTION
    function drawRect(context, x, y, w, h, angle, color, opacity) {

        const rx = Math.cos(angle) * w;
        const ry = 0.5 * w;

        context.save();
        context.translate(x, y);
        //context.strokeStyle = "black";
        context.fillStyle = color;
        context.lineWidth = 3;
        //context.translate(rx * -0.5, (ry + h) * -0.5);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(rx, ry);
        context.lineTo(rx, ry + h);
        context.lineTo(0, h);

        context.closePath();
        context.globalAlpha = opacity;

        context.fill();
        //context.stroke();
        context.restore();
    }



    function drawLines(context, width, velocity) {
        randomLineValues.forEach((e, i) => {

            const thisVelocity = Math.sin(random.noise2D(i , 0, velocity ) * 100) * 100 

            const thisX = e.x1 + thisVelocity;
            //const randomY = randomRange(0, width / 2)
            context.save();
            context.translate(0, width / 2);
            context.strokeStyle = linesColor;
            //context.fillStyle = "blue";
            context.lineWidth = e.width;
            //context.translate(rx * -0.5, (ry + h) * -0.5);
            context.beginPath();
            context.moveTo(thisX, e.y1);
            context.lineTo(thisX + Math.sin(random.noise2D(i , 100, velocity ) * 100) * 100, e.y2);
            //context.closePath();
            //context.globalAlpha = opacity;
            //context.fill();
            context.stroke();
            context.restore();
        })
    };


    return (
        <div 
        style={{
            width: "100%",
            height: "100vh",
            //background: "pink",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",           
        }}>
            <div 
            style={{
                display: "inline-flex",
                gap: "50px",
                margin: "20px 0px",
            }}>
                <button 
                onClick={() => setAnimateHandler(!animateHandler)}
                >animation on/off</button>

                <button 
                onClick={() => setDrawHandler(!drawHandler)}
                >draw on/off</button>

                <select onChange={(e) => {
                    setPresset(e.target.value);
                    setReset(!reset);
                    }}>
                    <option>normal</option>
                    <option>incoming</option>
                </select>

                <button 
                onClick={() => setReset(!reset)}
                >reset</button>

            </div>
            <canvas id="canvas" ref={canvasRef} height={canvasSize} width={canvasSize} style={{background: canvasColor}} />
        </div>
    )
}
