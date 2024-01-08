import { useRef, useState } from 'react';
import './App.css';

//components
import Canvas from './components/Canvas';
import CanvasRecorder from './components/Recording';

function App() {

  const canvasRef = useRef(null);   
  const [canvasSize, setCanvasSize] = useState(0);

  return (
    <div className="App">

      <Canvas 
      canvasRef={canvasRef}
      canvasSize={canvasSize} 
      setCanvasSize={setCanvasSize}
      />

      <CanvasRecorder 
      canvasRef={canvasRef} 
      canvasSize={canvasSize} 
      />
    </div>
  );
}

export default App;
