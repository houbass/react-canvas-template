// COMPONENTS
import SizeDef from './SizeDef';
import DownloadImages from './DownloadImages';
import AnimationSettings from './AnimationSettings';

export default function Ui({ 
    setCanvasSize, recHandler, setRecHandler, 
    images, animateHandler, setAnimateHandler, 
    drawHandler, setDrawHandler, setPresset, 
    reset, setReset
    }) {

    return(
        <div 
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "20px 0",
        }}>
            <SizeDef 
            setCanvasSize={setCanvasSize}
            />

            <DownloadImages 
            recHandler={recHandler}
            setRecHandler={setRecHandler} 
            images={images}
            />

            <AnimationSettings
                animateHandler={animateHandler} 
                setAnimateHandler={setAnimateHandler} 
                drawHandler={drawHandler} 
                setDrawHandler={setDrawHandler} 
                setPresset={setPresset} 
                reset={reset}
                setReset={setReset}
            />
        </div>
    )
}