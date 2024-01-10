import JSZip from 'jszip';
import { saveAs } from 'file-saver';


export default function DownloadImages({ recHandler, setRecHandler, images }) {


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


    return(
    <div 
    style={{
        width: "100%",
        display: "inline-flex",
        justifyContent: "center",
        gap: "15px",
        margin: "10px 0px",
    }}
    >
        <button 
        onClick={() => {
          setRecHandler(true);
          images.current = [];
        }}
        disabled={recHandler}
        >start rec</button>

        <button 
        onClick={() => setRecHandler(false)} 
        disabled={!recHandler} 
        >stop rec</button>

        <button 
        onClick={() => handleDownload(images.current)}
        >Download Images as ZIP</button>
    </div>
    )
}