


export default function AnimationSettings({ animateHandler, setAnimateHandler, drawHandler, setDrawHandler, setPresset, reset, setReset }) {

    return(
        <div 
        style={{
            display: "inline-flex",
            justifyContent: "center",
            gap: "15px",
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
    )
}