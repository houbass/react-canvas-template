import React, { useEffect, useRef, useState } from "react";


//CANVAS SKETCH FUNKCE
const random = require ('canvas-sketch-util/random');

export default function Canvas({ canvasRef, recHandler, images, animateHandler, drawHandler, presset, reset }) {

    // STATES
    const [yShift, setYShift] = useState(0);


    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0});
    const [randomPoints, setRandomPoints] = useState([]);
    const [randomPoints2, setRandomPoints2] = useState([]);

    // SETTINGS
    const canvasColor = "rgb(20, 20, 20)";

    // horizont line & points setting
    const horizontY = -150;
    const horizontY2 = canvasSize.height + 150;
    const hpx1 = 0;
    const hpx2 = 2000;
    const maxY = 1000;
    const divHeight = 800;
    const maxY2 = maxY + divHeight;

    // random points setting
    const randomPointsQuantity = 20;

    // scrolling listener
    function scrollFun() {
        setYShift(window.scrollY)
    }

    useEffect(() => {
        window.addEventListener("scroll", scrollFun);

        return() => {
            window.removeEventListener("scroll", scrollFun);
        }
    })

    // set canvas size based on screen
    useEffect(() => {
        scrollFun();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        setCanvasSize({
            width: screenWidth,
            height: screenHeight
        })
    }, [])

    // create grid points
    useEffect(() => {
        const thisPoints = []
        const thisPoints2 = []
        for(let i = 0; i < randomPointsQuantity; i++) {
            const thisX = canvasSize.width * 10 / randomPointsQuantity * i

            // bottom
            if(i > 0) {
                thisPoints.push(new randomPointsClass(thisX, maxY));
                thisPoints2.push(new randomPointsClass2(thisX, maxY2));
            }
            thisPoints.push(new randomPointsClass(thisX * -1, maxY));
            thisPoints2.push(new randomPointsClass2(thisX * -1, maxY2));
        }

        setRandomPoints(thisPoints);
        setRandomPoints2(thisPoints2);
    }, [reset, canvasSize])


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

                // HORIZONT LINE
                context.save();
                context.strokeStyle = "white";
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(0, horizontY);
                context.lineTo(canvasSize.width, horizontY);
                context.stroke();
                context.restore();

                // HORIZONT POINT 1
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 3;
                context.beginPath();
                context.arc(hpx1, horizontY, 10, 0, 2 * Math.PI);
                context.fill();
                context.restore();

                // HORIZONT POINT 2
                context.save();
                context.fillStyle = "white";
                context.lineWidth = 3;
                context.beginPath();
                context.arc(hpx2, horizontY, 10, 0, 2 * Math.PI);
                context.fill();
                context.restore();

                // upper grid
                randomPoints.forEach(e => {
                    e.update(yShift)
                    e.draw(context, e);
                })

                // bottom grid
                randomPoints2.forEach(e => {
                    e.update(yShift);
                    e.draw(context, e);
                })
                                                
            }
            drawing();
        };
        render();

        //animation cancel when re-render component
        return () => cancelAnimationFrame(timerHolder);

    });


    // CLASSES
    class randomPointsClass {
        constructor(x, y) {
            this.x = x;
            this.y = y
        }

        // update y when scroll
        update(yDelta) {
            this.y = maxY - yDelta;
        }

        // draw lines
        draw(context, e) {
            // line 1
            context.save();
            context.strokeStyle = "white";
            context.lineWidth = 1.5;
            context.beginPath();
            context.moveTo(hpx1, horizontY);
            context.lineTo(e.x, e.y);
            context.stroke();
            context.restore();

            // line 2
            context.save();
            context.strokeStyle = "white";
            context.lineWidth = 1.5;
            context.beginPath();
            context.moveTo(hpx2, horizontY);
            context.lineTo(e.x, e.y);
            context.stroke();
            context.restore();
        }


    }

    class randomPointsClass2 {
        constructor(x, y) {
            this.x = x;
            this.y = y
        }

        // update y when scroll
        update(yDelta) {
            this.y = maxY2 - yDelta;
        }

        // draw lines
        draw(context, e) {
            // line 1
            context.save();
            context.strokeStyle = "white";
            context.lineWidth = 1.5;

            context.beginPath();
            context.moveTo(hpx1, horizontY2);
            context.lineTo(e.x, e.y);
            context.stroke();
            context.restore();

            // line 2
            context.save();
            context.strokeStyle = "white";
            context.lineWidth = 1.5;
            context.beginPath();

            context.moveTo(hpx2, horizontY2);
            context.lineTo(e.x, e.y);
            context.stroke();
            context.restore();
        }
    }


    return (
        <div 
        style={{
            width: "100%",
            //height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",           
        }}>

            <div 
            style={{
                width: "100%",
                height: divHeight + "px",
                background: "white",
                //top: maxY,
                marginTop: maxY,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
                
            }}>
                <div>
                    <h1 className="title">Shifting perspectives</h1>
                    <h1 className="title">expanding horizons</h1>
                </div>
            </div>

            <div 
            style={{
                width: "100%",
                height: "1000px",
                background: "rgb(20,20,20)",
                opacity: "1",
                //top: maxY,
                marginTop: maxY,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                //zIndex: "-10"
                //justifyContent: "center"
            }}>

                <div className="container">
                    <div className="pad1">
                        <h1 className="title2">Perspective is the lens through which reality unfolds</h1>
                    </div>
                </div>
            </div>

            <div 
            style={{
                width: "100%",
                height: "1000px",
                background: "rgb(220,220,220)",
                opacity: "1",
                //top: maxY,
                //marginTop: maxY,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                //zIndex: "-10"
                //justifyContent: "center"
            }}>

                <div className="container">
                    <div className="pad1">
                        <h1 className="title">Change your view</h1>
                        <h1 className="title">change your world</h1>
                    </div>
                </div>
            </div>
            

            <canvas id="canvas" ref={canvasRef} height={canvasSize.height} width={canvasSize.width} style={{background: canvasColor}} />
        </div>
    )
}
