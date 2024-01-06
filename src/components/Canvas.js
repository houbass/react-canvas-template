import React, { useEffect, useRef, useState } from "react";

export default function Canvas() {
    const canvasRef = useRef(null);

    const [animateHandler, setAnimateHandler] = useState(true);

    const width = window.innerWidth - 50;
    const height = window.innerHeight - 50;

    //arc definition
    const r = 10;
    const x = useRef(r);
    const v = useRef(0);

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

            function drawing() {
                //bouncing left and right
                x.current = x.current + v.current;
                if(x.current > canvas.width - r){
                    v.current = -1;
                }else if(x.current <= 0 + r){
                    v.current = 1;
                }

                //canvas shape
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.arc(x.current, 75, r, 0, 2 * Math.PI);
                context.stroke();
            }

            drawing()
        };
        render();

        //animation cancel
        return () => cancelAnimationFrame(timerHolder);
    });

    return (
        <div 
        style={{
            width: "100%",
            height: "100vh",
            background: "pink",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>

            <button 
            onClick={() => setAnimateHandler(!animateHandler)}
            >animation on/off</button>
            <canvas id="canvas" ref={canvasRef} height={height} width={width} style={{background: "orange"}} />
        </div>
    )
}
