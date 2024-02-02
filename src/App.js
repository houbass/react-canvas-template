import { useRef, useState } from 'react';
import './App.css';

//components
import Ui from './components/Ui';
import Canvas from './components/Canvas';

function App() {

  
  // REFS
  const canvasRef = useRef(null);   
  const images = useRef([]);

  // STATES
  // canvas settings
  const [canvasSize, setCanvasSize] = useState(0);
  const [recHandler, setRecHandler] = useState(false);
  // annimation settings states
  const [animateHandler, setAnimateHandler] = useState(false);
  const [drawHandler, setDrawHandler] = useState(false);
  const [presset, setPresset] = useState("normal");
  const [reset, setReset] = useState(true);
  
  return (
    <div className="App">
      
      {/*
      <Ui 
        setCanvasSize={setCanvasSize} 
        recHandler={recHandler}
        setRecHandler={setRecHandler} 
        images={images} 
        animateHandler={animateHandler}
        setAnimateHandler={setAnimateHandler}
        drawHandler={drawHandler}
        setDrawHandler={setDrawHandler} 
        setPresset={setPresset} 
        reset={reset}
        setReset={setReset}
      />
      */}
      
      <Canvas 
      canvasRef={canvasRef}
      canvasSize={canvasSize} 
      recHandler={recHandler} 
      images={images}
      animateHandler={animateHandler}
      drawHandler={drawHandler}
      presset={presset} 
      reset={reset}
      />



    </div>
  );
}

export default App;
