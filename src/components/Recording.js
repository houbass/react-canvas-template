import React, { useEffect, useRef, useState } from 'react';

const CanvasRecorder = ({ canvasRef, canvasSize }) => {
  const canvas = canvasRef;
  const videoRef = useRef();
  const [recorder, setRecorder] = useState(null);

  // INIT
  function createMedia() {
    const stream = canvas.current.captureStream(60);
    // Adjust the videoBitsPerSecond to control video quality
    const videoBitsPerSecond = 960000000000000000; // Adjust as needed
    setRecorder(new MediaRecorder(stream, { type: 'video/webm;codecs=h265', videoBitsPerSecond }));
  }

  // START RECORDING
  function startRec() {
    console.log("RECORDING");
    recorder.start();
  }

  // STOP RECORDING AND DOWNLOAD
  function stopRec() {
    recorder.stop();
    recorder.addEventListener('dataavailable', (evt) => {      
      const url = URL.createObjectURL(evt.data);
      videoRef.current.src = url;

      // DOWNLOAD VIDEO
      const downloadVideoLink = document.createElement('a');
      downloadVideoLink.href = url;
      downloadVideoLink.download = 'recorded-video.webm';
      document.body.appendChild(downloadVideoLink);
      downloadVideoLink.click();
      document.body.removeChild(downloadVideoLink);
    });

    //reset
    createMedia();
  }


  // IMG CAPTURE
  function imgRec() {
    const dataURL = canvas.current.toDataURL("image/png", 1.0);
    const downloadVideoLink = document.createElement('a');
    downloadVideoLink.href = dataURL;
    downloadVideoLink.download = 'img.png';
    document.body.appendChild(downloadVideoLink);
    downloadVideoLink.click();
    document.body.removeChild(downloadVideoLink);
  }


  // FIRS LOAD OR ON RESIZE
  useEffect(() => {
    createMedia();
    // eslint-disable-next-line
  }, [canvasSize]);

  return (
    <div>
      <button onClick={startRec}>start rec</button>
      <button onClick={stopRec}>stop rec</button>
      <button onClick={imgRec}>printscreen</button>
      <video ref={videoRef} controls></video>
    </div>
  );
};

export default CanvasRecorder;
