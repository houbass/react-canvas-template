import React, { useEffect, useRef, useState } from "react";

//CANVAS SKETCH FUNKCE
const random = require ('canvas-sketch-util/random');

export default function Canvas({ canvasRef, canvasSize, recHandler, images, animateHandler, drawHandler, presset, reset }) {

    // REFS 
    const angle = useRef(0);

    // STATES
    const [randomRectValues, setRandomRectValues] = useState([]);
    const [randomLineValues, setRandomLineValues] = useState([]);

    // PATTERN INPUTS
    const canvasColor = "rgb(25, 25, 25)";
    const textColor = "white"

    // ORBITS SETTINGS
    const patternIputs = [
        {  
            quantity: 90,
            //color: "rgba( 225, 50, 40)",
            color: "rgb(225, 225, 225)",
            width: 15,
            height: 15
        }, 
        {  
            quantity: 90,
            //color: "rgba( 225, 50, 40)",
            color: "rgb(225, 225, 225)",
            width: 15,
            height: 15
        },     
        {  
            quantity: 90,
            //color: "rgba( 225, 50, 40)",
            color: "rgb(225, 225, 225)",
            width: 15,
            height: 15
        }, 
        {  
            quantity: 90,
            //color: "rgba( 225, 50, 40)",
            color: "rgb(225, 225, 225)",
            width: 15,
            height: 15
        }, 
        {  
            quantity: 90,
            //color: "rgba( 225, 50, 40)",
            color: "rgb(225, 225, 225)",
            width: 15,
            height: 15
        }, 
        {  
            quantity: 90,
            //color: "rgba( 225, 50, 40)",
            color: "rgb(225, 225, 225)",
            width: 15,
            height: 15
        }, 

    ];

    // LINES SETTINGS 
    const linesQuantity = 50;
    const linesYRange = [canvasSize * -1 / 10, canvasSize / 10];
    const linesColor = "rgb(185, 185, 185)";
    const linesMaxLength = 10;
    const linesWeight = [1, 5];

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

    // CREATE RANDOM LINES
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
        const context2 = canvas.getContext("2d");

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
                    //context.clearRect(0, 0, width, height);
                    //context2.clearRect(0, 0, width, height);

                    context.fillStyle = canvasColor;
                    context.fillRect(0, 0, width, height);
                }
                
                // UPDATING ANGLE
                angle.current += 0.0000002;                

                // ORBITING ELEMENTS BACK                
                orbitingEl(context, angle.current , "b", width, 0);
                     
                // MIDLE LINES
                //drawLines(context, width, angle.current);
            
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
        resetFun();
        //resizeFun()
        angle.current = 0;
        // eslint-disable-next-line
    }, [reset, canvasSize])

    function resetFun() {
        setRandomRectValues(
            patternIputs.map((e, i) => {
                return getRandomElements(e.quantity, i, e.color, canvasSize, e.width, e.height)
            })
        );
        setRandomLineValues(getRandomLines(canvasSize, linesQuantity, linesColor))
    }


    //ORBITING ELEMENTS (FRONTSIDE / BACKSIDE)
    function orbitingEl(context, loopMotion, position, width, yChange) {
        //const quant = patternIputs.length;
        const quant = 2;
        //const quant = 
        //ELEMENTS
        randomRectValues.forEach((i, index) => {                           
            let shift;
            i.forEach((e, indexx) => {                
                const prevShift = shift;
                
                switch(presset) {
                    case "normal":
                        shift = Math.sin(toRads((random.noise2D(indexx, 0, 0.0001 + loopMotion) + (index * 30)))); 
                        break;
                    case "incoming":
                        shift = Math.sin(toRads(random.noise2D(indexx / loopMotion / 100000, 0, 0.0001 + loopMotion) + (index * 30)));
                        break;
                    default:
                        shift = Math.sin(toRads(random.noise2D(indexx, 0, 0.00001 + loopMotion))); 
                        break;
                }

                const thisY = (((width / 4)* shift * 0.8) + ((width / 2)));      
                const thisYMin = (((width / 4) * - 1 * 0.8) + ((width / 2))); 
                const thisYMax = (((width / 4) * 1 * 0.8) + ((width / 2))); 
                const minMax = [thisYMin, thisYMax];
                //console.log(minMax[1])

                    
                let color;
                let scaleVector;

                if(position === "b") {
                    if(prevShift > shift) {
                        color = "transparent"; 
                        scaleVector = -1;

                    } else{
                        color = e.color;        
                        scaleVector = 1;
                    }
                } else if(position === "f") {
                    if(prevShift > shift) {
                        color = e.color;  
                        scaleVector = -1;
                    } else{
                        color = "transparent";     
                        scaleVector = 1  
                    }
                } else {
                    color = "white"; 
                    scaleVector = 1;
                }
            
                drawRect(
                    context, 
                    e.x,    // X
                    thisY,  // Y
                    e.width,    // WIDTH
                    e.height,   // HEIGHT
                    //angle.current,  // ANGLE
                    //angle.current + (indexx / 1000),
                    0,
                    color,
                    e.opacity,
                    scaleVector,
                    shift,
                    minMax
                );

            });                                       
        });
    };





    // DRAW RECTANGLE FUNCTION
    function drawRect(context, x, y, w, h, angle, color, opacity, scaleVector, shift, minMax) {


        //console.log(shift)
        
        const mid = ((minMax[1] - minMax[0]) / 2) + minMax[0]
        //console.log(Math.sin(450))

        //const thisShift = (5 * (Math.sin(toRads(y/ 8000)))) * scaleVector * 1;

        let thisShift;
            if(scaleVector < 0){
                thisShift = 4 + (2 * Math.sin(toRads(mid - y / 3600)))
            } else{
                thisShift = 0.5 + ((2 * Math.sin(toRads(mid - y / 3600))) * -1)
            }

            // IF BELLOW ZERO
            if(thisShift <0.5) {
                thisShift = 0.5;
            }

    

        const rx = Math.cos(angle) * w;
        const ry = 0.5 * w;

        context.save();
        context.translate(x, y);
        //context.strokeStyle = "black";
        context.fillStyle = color;
        context.lineWidth = 3;
        //context.translate(rx * -0.5, (ry + h) * -0.5);
        context.beginPath();
        context.arc(0, 0, thisShift, 0, 2 * Math.PI);
        //context.fillRect(0, 0, 10, 10);
        context.font = "20px serif";
        //context.fillText(y.toFixed(0), 10, 0);

        context.closePath();
        //context.globalAlpha = opacity;

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
            context.lineTo(thisX + Math.sin(random.noise2D(i , 100, velocity ) * 10) * 200, e.y2);
            //context.closePath();
            //context.globalAlpha = Math.sin(random.noise2D(i , 100, velocity ) * 100);
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",           
        }}>

            <canvas id="canvas" ref={canvasRef} height={canvasSize} width={canvasSize} style={{background: canvasColor, }} />
        </div>
    )
}
