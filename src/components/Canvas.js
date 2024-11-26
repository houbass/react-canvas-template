import React, { useEffect, useRef, useState, useMemo } from "react";

export default function Canvas() {
    const canvasRef = useRef(null);
    const mainRef = useRef(0);

    // States
    const animateHandler = true;
    const [data, setData] = useState([])

    // Canvas settings
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Montains field settings
    const sideOffset = 50;
    const xAxisLength = width + (2 * sideOffset);
    const yAxisLength = 200;

    const lineWidth = 5;
    const maxDataArrLength = 30;
    const numberOfLayers = 30;
    const color1 = "rgb(20,20,20)";
    const color2 = "rgb(245,245,245)";

    const colors = useMemo(() => {
        const thisColors = [];
        for(let i = 0; i < numberOfLayers; i++) {
            const isEven = i % 2 === 0;
            isEven ? thisColors.push(color1) : thisColors.push(color2)
        }

        return thisColors
    }, [])


    const scrollRate = 30

    /*
        "#59bab7",        
        "#6f66ff",
        "#ff9a52",
        "#008387",
        "#008cff",
        "#ff5c77",
    */


    // Utils
    function randomRangeNumber (min, max) {
        const number = min + (Math.random() * (max - min));
        const roundNumber = Math.round(number)
        return roundNumber
    }

    function newDataHandler () {
        const newData = [];
        while( newData.length < colors.length)  {
            const index = newData.length
            const color = colors[index]
            const i = index + 1;
            const isEven = i % 2 === 0;
            const randomNumber = randomRangeNumber(10, 1000)
            const numberArr = isEven ? getNumberArr(randomNumber) : getNumberArr(randomNumber).reverse();
            const dataObj = {
                data: numberArr,
                color: color,
                yOffset: height / (i + (1.5 * i))
            }

            if (numberArr.length < maxDataArrLength) {
                newData.push(dataObj)
            }
        }

        console.log(newData.length)
        setData(newData.reverse())
    }

    function getY (number, yStep, yOffset) {
        return (yAxisLength - (yStep * number)) + yOffset;
    }

    function getNumberArr (number) {
        const numberArr = [1, number];
        /*
        let i = number;
        while (i > 1) {
            const isEven = i % 2 === 0

            if(isEven) {
                i = i / 2;
                numberArr.push(i);
            } else {
                i = i * 3 + 1;
                numberArr.push(i);
            }
        }
        */

        let i = number;
        while (i > 1) {
            const isEven = i % 2 === 0;
        
            if (isEven) {
                i = i / 2;
                numberArr.push(i);
            } else {
                i = (i * 3 + 1) / 2; // Modified odd-case behavior
                numberArr.push(i);
            }
        }
        

        numberArr.push(0)
        
        return numberArr
    }

    function drawing(context, canvas) {         
        //clear previous frame
        context.clearRect(0, 0, canvas.width, canvas.height);        
        
        function drawHills(data, color, xOffset, yOffset, index) {

            const leftOffset = (-1 * sideOffset) + xOffset;

            let region = new Path2D();
            region.moveTo(leftOffset, yAxisLength + yOffset);
            data.forEach((item, index) => {
                const xStep = xAxisLength / (data.length - 1);
                const thisX = index * xStep + leftOffset;

                const highestNumber = [...data].sort((a, b) => b - a)[0];
                const yStep = yAxisLength / highestNumber;
                const nextY = getY (data[index + 1], yStep, yOffset);

                region.lineTo(thisX + xStep, nextY);
            })

            region.lineTo(xAxisLength, height);
            region.lineTo(leftOffset, height)

            region.closePath();
            


            const isEven = index % 2 === 0;
            const stroke = color === color1 ? color2 : color1;

            // Fill path
            context.fillStyle = color1;
            context.strokeStyle = color2;

            context.lineWidth = lineWidth;
            context.stroke(region);
            context.fill(region, "evenodd");
            
        }

        //context.stroke(region, "black");
        data.forEach((item, index) => {

            const xOffset = index % 2 === 0 ? -1 * mainRef.current : mainRef.current;

            drawHills(
                item.data, 
                item.color, 
                xOffset,
                item.yOffset + (mainRef.current * (index + 1)),
                index,
            )
        })
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

            context.scale(1, 1)

            //ANIMATION ON/OFF
            if(animateHandler === true) {
                timerHolder = window.requestAnimationFrame(render);
            } else{
                timerHolder = null;
            }

            if(data) {
                drawing(context, canvas)
            }            
        };
        render();

        //animation cancel
        return () => cancelAnimationFrame(timerHolder);
    }, [data, animateHandler]);

    // On init
    useEffect(() => {
        newDataHandler();
    }, [])


    function onScroll() {
        console.log(Math.round(window.pageYOffset))
        const getScrollOffset = Math.round(window.pageYOffset);
        mainRef.current = getScrollOffset / scrollRate;

    }

    useEffect(() => {
            window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    })

    return (
        <div 
            
            style={{
                width: "100%",
                height: "400vh",
                background: "pink",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    position: "fixed",
                }}
            >
                <canvas 
                    id="canvas" 
                    ref={canvasRef} 
                    height={height} 
                    width={width} 
                    style={{
                        background: color1,
                    }} 
                />
            </div>
        </div>
    )
}
