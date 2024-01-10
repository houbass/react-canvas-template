import { useRef, useState } from 'react';
import './App.css';


import JSZip from 'jszip';
import { saveAs } from 'file-saver';

//components
import Canvas from './components/Canvas';
import CanvasRecorder from './components/Recording';

function App() {

  const canvasRef = useRef(null);   
  const [canvasSize, setCanvasSize] = useState(0);
  const [imagesArr, setImagesArr] = useState([]);


  console.log(imagesArr);


  // DOWNLOAD ZIP OF PNGs
  const handleDownload = async (images) => {
    const zip = new JSZip();

    // Assuming images is an array of file paths or blobs
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageData = await fetch(image).then((response) => response.blob());

      // You can adjust the file name in the zip file as needed
      zip.file(`${i + 1}.png`, imageData);
    }

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });

    // Save the zip file
    saveAs(content, 'images.zip');
  };


  
  return (
    <div className="App">
      <button onClick={() => handleDownload(imagesArr)}>Download Images as ZIP</button>

      <Canvas 
      canvasRef={canvasRef}
      canvasSize={canvasSize} 
      setCanvasSize={setCanvasSize} 
      setImagesArr={setImagesArr}
      />

      <CanvasRecorder 
      canvasRef={canvasRef} 
      canvasSize={canvasSize} 
      />

    </div>
  );
}

export default App;
