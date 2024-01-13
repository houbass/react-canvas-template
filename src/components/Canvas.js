import React, { useEffect, useRef, useState } from "react";

// FUNCTIONS
import {drawLine, bezierCurve} from "./DrawingFunctions";
import { curvePatternFun } from "./PaternFunctions";
import { toRads, randomRange } from "./HelpingFunctions";

//CANVAS SKETCH FUNKCE
const random = require ('canvas-sketch-util/random')

export default function Canvas({ canvasRef, canvasSize, recHandler, images, animateHandler, drawHandler, presset, reset }) {

    // REFS 
    const angle = useRef(0);
    const v = useRef(0);

    const opacity = useRef(0);
    const opacity2 = useRef([0, 0, 0, 0])

    // STATES
    const [curvesPattern, setCurvesPattern] = useState([]);

    // PATTERN INPUTS
    const canvasColor = "rgb(255, 120, 90)";

    // ORBITS SETTINGS
    /*
    const curveIputs = [
        {
            yAxis: 500,
            firstYShift: 0,
            inputShifts: [0, 0, 0]
        },
        {
            yAxis: 500,
            firstYShift: 10,
            inputShifts: [0, 0, 0]
        },
        {
            yAxis: 500,
            firstYShift: 20,
            inputShifts: [0, 0, 0]
        },
    ]
    */

    
    const curveIputs = [
        {
            yAxis: 500,
            firstYShift: 0,
            inputShifts: [-150, -300, -300]
        },
        {
            yAxis: 500,
            firstYShift: 0,
            inputShifts: [-130, -350, -300]
        },
        {
            yAxis: 500,
            firstYShift: 150,
            inputShifts: [-100, -450, -300]
        },
        {
            yAxis: 500,
            firstYShift: 200,
            inputShifts: [-50, -550, -300]
        },
        {
            yAxis: 500,
            firstYShift: 200,
            inputShifts: [-80, -550, -350]
        },
        {
            yAxis: 500,
            firstYShift: 200,
            inputShifts: [-100, -550, -450]
        },
    ];
    

    // GET CURVES
    useEffect(() => {
        const thisValus = [];
        curveIputs.forEach(e => {
            thisValus.push(curvePatternFun(canvasSize , e.yAxis, e.firstYShift, e.inputShifts))
        })
        setCurvesPattern(thisValus)
    }, [canvasSize])


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

            // CAPTURE IMAGES
            imgCapture(canvas)

            // DRAWING
            function drawing() {
                // DRAWING FUNCTION
                if(drawHandler === true) {
                    
                } else{
                    //context.clearRect(0, 0, width, height);
                    context.fillStyle = canvasColor;
                    context.fillRect(0, 0, width, height);
                }
                
                // UPDATING ANGLE
                //angle.current += 1;                

                // LINES  
                //let lineV = 1;     
                if(angle.current > width){
                    v.current = -10;
                }else if(angle.current <= 0){
                    v.current = 10;
                }
                angle.current += v.current; 

                drawLine(context, 100 + angle.current, 200)            
                drawLine(context, 200 - angle.current, 500)             
                



                curvesPattern.forEach((curve, index) => {
                    //let check = (Math.sin(toRads(opacity.current + (index * (180 / curvesPattern.length)))) + 1) / 2;
                    let check = Math.sin(toRads(opacity.current + (index * (180 / curvesPattern.length))))    

                    if(check < 0) {
                        check = 0;
                    }

                    //console.log(check)
                    const thisOpacity = check / 2

                    curve.forEach(e => {
                        bezierCurve(context, e.start, e.cp1, e.cp2, e.end, thisOpacity)
                    })
                })

                opacity.current += 3;


            }
            drawing();
        };
        render();

        //animation cancel when re-render component
        return () => cancelAnimationFrame(timerHolder);
    });



    // CAPTURE IMAGES
    function imgCapture(canvas) {
        if(recHandler === true) {
            images.current=([
                ...images.current, canvas.toDataURL("image/png", 1.0)
            ])
        }
    }

    // ON START / RESET / CANVAS SIZE
    useEffect(() => {
        //angle.current = 0;

        // eslint-disable-next-line
    }, [reset, canvasSize])

    return (
        <div 
        style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",           
        }}>

            <canvas id="canvas" ref={canvasRef} height={canvasSize} width={canvasSize} />
        </div>
    )
}
