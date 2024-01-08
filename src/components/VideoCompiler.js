
/* NEFUNGUJE */



import React, { useState, useEffect } from 'react';
import ffmpeg from 'ffmpeg.js/ffmpeg-mp4.js'; // Adjust the path based on your project structure

const VideoCompiler = ({ images }) => {
  const [videoBlob, setVideoBlob] = useState(null);

  const width = 1024;
  const height = 1024;
  const fps = 24;
  
  
  useEffect(() => {
    const compileVideo = async () => {
      const worker = new Worker(ffmpeg);

      // Message handler for the worker
      worker.onmessage = (event) => {
        const message = event.data;

        if (message.type === 'compiled') {
          setVideoBlob(new Blob([message.data], { type: 'video/mp4' }));
        }
      };

      // Prepare and send data to the worker
      worker.postMessage({
        type: 'compile',
        images,
        fps,
        width,
        height,
      });
    };

    compileVideo();
  }, [images, fps, width, height]);

  return (
    <div>
      {videoBlob ? (
        <video width={width} height={height} controls>
          <source src={URL.createObjectURL(videoBlob)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Compiling video...</p>
      )}
    </div>
  );
};

export default VideoCompiler;