import { useRef, useState } from 'react';
import './App.css';

//components
import Canvas from './components/Canvas';
import CanvasRecorder from './components/Recording';
import DownloadImages from './components/DownloadImages';

function App() {

  // REFS
  const canvasRef = useRef(null);   
  const images = useRef([]);

  // STATES
  const [canvasSize, setCanvasSize] = useState(0);
  const [recHandler, setRecHandler] = useState(false);

  
  return (
    <div className="App">
      
      <DownloadImages 
        recHandler={recHandler}
        setRecHandler={setRecHandler} 
        images={images}
      />

      <Canvas 
      canvasRef={canvasRef}
      canvasSize={canvasSize} 
      setCanvasSize={setCanvasSize} 
      recHandler={recHandler} 
      images={images}
      />

      <CanvasRecorder 
      canvasRef={canvasRef} 
      canvasSize={canvasSize} 
      />

    </div>
  );
}

export default App;
