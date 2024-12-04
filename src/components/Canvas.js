import React, { useEffect, useRef, useState, useMemo } from "react";

export default function Canvas() {
    const canvasRef = useRef(null);
    
    // States
    const [animateHandler, setAnimateHandler] = useState(true);
    const diameter = 25;
    const x = useRef(0);
    const direction = useRef(1);

    // Canvas settings
    const width = window.innerWidth;
    const height = window.innerHeight - 30;

    // Utils
    function randomRangeNumber (min, max) {
        const number = min + (Math.random() * (max - min));
        const roundNumber = Math.round(number)
        return roundNumber
    }

    function animate() {
        // Update the position
        x.current += direction.current * 5;

        // Check boundaries and reverse direction if needed
        if (x.current <= 0 || x.current >= width) {
            direction.current *= -1; 
        }
    }

    function draw(context, canvas) {         
        //clear previous frame
        context.clearRect(0, 0, canvas.width, canvas.height);        

        // Animate
        animate();

        // Draw circle
        context.beginPath();
        context.arc(x.current, 75, diameter, 0, 2 * Math.PI);
        context.fill()
        context.stroke();
    }

    // Draw Canvas
    useEffect(() => {
        //canvas def
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        //animation handler (zabranuje aby se animace zrychlovala po kazdem updatu)
        let timerHolder = null;

        //animation function
        function render() { 

            //ANIMATION ON/OFF
            if(animateHandler === true) {
                timerHolder = window.requestAnimationFrame(render);
            } else{
                timerHolder = null;
            }

            draw(context, canvas)         
        };
        render();

        //animation cancel
        return () => cancelAnimationFrame(timerHolder);
    }, [animateHandler]);


    return (
        <div 
            style={{
                width: "100%",
                height: "calc(100vh - 100px)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <button 
                style={{
                    background: 'rgb(20,20,20)',
                    color: 'white',
                    minHeight: '30px',
                    cursor: 'pointer'
                }}
                onClick={() => {setAnimateHandler(!animateHandler)}}
            >
                Animate on/off
            </button>

            <canvas 
                id="canvas" 
                ref={canvasRef} 
                height={height} 
                width={width} 
                style={{
                    background: "orange",
                }} 
            />
        </div>
    )
}
