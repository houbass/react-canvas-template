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
    const [reset, setReset] = useState(true);

    // PATTERN INPUTS
    const canvasColor = "rgb(0, 0, 0)";
    const patternIputs = [
        {  
            quantity: 2500,
            color: "rgba( 225, 50, 40)",
            //color: "black",
            width: 180,
            height: 15
        }, 

    ]

    // DEG TO RADS
    function toRads(deg) {
        return (deg / (Math.PI / 180));
    }

    // RANDOM NUMBER
    function randomRange(min, max) {
        return Math.round(min + (Math.random() * (max - min)))
    }

    // CREATE RANDOM
    function getRandomElements(quantity, index, color, size, w, h ) {
        let thisRandoms = [];
        for(let i = 0; i < quantity + 100; i++) {

            const thisValues = {
                x: size / quantity * i - 50,
                //y: ((((size / 2) - 70) / quant) * shift) + (index * (size / quant)) + (((size / 2) - 35) / quant) ,
                width: randomRange(0, w),
                height: randomRange(0, h),
                color: color,
                opacity: String(Math.round(Math.random()))
            };

            thisRandoms.push(thisValues);
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


        // animation function
        function render() { 

            // ANIMATION ON/OFF
            if(animateHandler === true) {
                timerHolder = window.requestAnimationFrame(render);
            } else{
                timerHolder = null;
            }


            function drawing() {
                // DRAWING FUNCTION
                if(drawHandler === true) {
                    
                } else{
                    context.clearRect(0, 0, width, height);
                }
                
                // UPDATING ANGLE
                angle.current += 0.00000002;
                const loopMotion = angle.current
                const quant = patternIputs.length;


                // FRONTSIDE ELEMENTS
                randomRectValues.forEach((i, index) => {                           
                    let shift;
                    i.forEach((e, indexx) => {                
                        const prevShift = shift;
                        
                        switch(presset) {
                            case "normal":
                                shift = Math.sin(toRads(random.noise2D(indexx, 0, 0.00001 + loopMotion))); 
                                break;
                            case "incoming":
                                shift = Math.sin(toRads(random.noise2D(indexx / loopMotion / 10000, 0, 0.00001 + loopMotion)));
                                break;
                            default:
                                shift = Math.sin(toRads(random.noise2D(indexx, 0, 0.00001 + loopMotion))); 
                                break;
                        }

                        const thisY = ((((width / 2) - 70) / quant) * shift) + (index * (width / quant)) + (((width / 2) - 35) / quant);
                            
                        let color;
                        if(prevShift > shift) {

                            color = "transparent"                    
                        } else{
                            color = e.color        
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
                })
            
            
                // TEXT
                context.save();
                context.translate(width / 9, height / 2);
                context.beginPath();
                context.fillStyle = "orange";
                context.font = width / 6 + "px arial";
                context.fillText("Hello world", 0, 0);
                context.fill();
                context.closePath();
                context.restore();
                
                   
                // BACKSIDE ELEMENTS
                randomRectValues.forEach((i, index) => {                           
                    let shift;
                    i.forEach((e, indexx) => {                        
                        const prevShift = shift;
                        
                        switch(presset) {
                            case "normal":
                                shift = Math.sin(toRads(random.noise2D(indexx, 0, 0.00001 + loopMotion))); 
                                break;
                            case "incoming":
                                shift = Math.sin(toRads(random.noise2D(indexx / loopMotion / 10000, 0, 0.00001 + loopMotion)));
                                break;
                            default:
                                shift = Math.sin(toRads(random.noise2D(indexx, 0, 0.00001 + loopMotion))); 
                                break;
                        }

                        const thisY = ((((width / 2) - 70) / quant) * shift) + (index * (width / quant)) + (((width / 2) - 35) / quant);
                                                    
                        let color;
                        if(prevShift > shift) {
                            color = e.color
                        } else{

                            color = "transparent"     
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
                })                                   
            }
            drawing()
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
    };

    useEffect(() => { 
        window.addEventListener("resize", resizeFun);
        return () => {
            window.removeEventListener("resize", resizeFun);
        }
    });


    // DRAW RECTANGLE FUNCTION
    function drawRect(context, x, y, w, h, angle, color, opacity) {

        const rx = Math.cos(angle) * w;
        const ry = Math.sin(angle) * w;

        context.save();
        context.translate(x, y);

        context.strokeStyle = "black";
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
