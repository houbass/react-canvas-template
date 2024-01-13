import { useEffect, useState } from 'react';

export default function SizeDef({ setCanvasSize }) {

    // STATES
    const [autosizeHandler, setAutosizeHandler] = useState(false);
    const [manualWidth, setManualWidth] = useState(1000);

    // RESIZE FUNCTION
    function setSizeFun(state) {
        // DECISION BETWEEN AUTO AND MANUAL WIDTH
        const thisState = typeof state === "string";
        let canSize;
        if(thisState === true) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const compare = [width, height].sort((a, b) => a - b);
            canSize = compare[0] * 0.9
        } else{
            canSize = state;
        }
        setCanvasSize(canSize);
    };

    function sizeInit() {
        if(autosizeHandler === true) {
            setSizeFun("auto");
        } else{
            setSizeFun(manualWidth);
        }
    }

    // SET SIZE WHEN PRESS ENTER
    function keyCheck(e) {
        if(e.key === "Enter" && autosizeHandler === false) {
            setSizeFun(manualWidth);
        }
    }

    // LISTENERS
    useEffect(() => { 
        window.addEventListener("keydown", keyCheck)
        return () => {
            window.removeEventListener("keydown", keyCheck)
        }
        // eslint-disable-next-line
    });

    // INIT SIZE FUN FIRST and on autosizeHandler change TIME TO GET SIZE OF CANVAS
    useEffect(() => {        
        sizeInit()
        // eslint-disable-next-line
    }, [autosizeHandler]);

    return(
        <div style={{
            display: "inline-flex",
            justifyContent: "center",
            gap: "15px",
        }}>
            <input 
            onChange={() => setAutosizeHandler(!autosizeHandler)} 
            type='checkbox' 
            id='autowidth' 
            name='autowidth' 
            checked={autosizeHandler}></input>
            <label htmlFor='autowidth' style={{color: "white"}}>auto size</label>

            <input onChange={(e) => setManualWidth(Number(e.target.value))} value={manualWidth} type='number' disabled={autosizeHandler}></input>
            <button onClick={() => setSizeFun(manualWidth)} disabled={autosizeHandler}>set</button>
        </div>
    )
}