import React, { useState, useEffect, useRef, Fragment } from 'react'; // quicker-photo-tuneup/src/App.jsx
import './App.css';

function App() {
  const [image, setImage] = useState(null); // State to store the uploaded image
  const [brightness, setBrightness] = useState(100); // State to store the brightness
  const [contrast, setContrast] = useState(100); // State to store the contrast
  const [saturation, setSaturation] = useState(100); // State to store the saturation
  const [grayscale, setGrayscale] = useState(0); // State to store the grayscale
  const [flipHorizontal, setFlipHorizontal] = useState(1); // State to store the horizontal flip
  const [flipVertical, setFlipVertical] = useState(1); // State to store the vertical flip
  const [rotate, setRotate] = useState(0); // State to store the rotation

  const canvasRef = useRef(null); // Reference to the canvas element

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current; // Get the canvas element
      const ctx = canvas.getContext('2d'); // Get the 2D context
      const img = new Image(); // Create a new image
      img.src = image; // Set the source of the image
      img.onload = () => { // When the image is loaded
        canvas.width = img.width; // Set the width and height of the canvas
        canvas.height = img.height; // Set the width and height of the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`; // Apply the filter
        ctx.translate(canvas.width / 2, canvas.height / 2); // Translate the origin to the center
        if (flipHorizontal !== 1 || flipVertical !== 1) { // Check if the flip is enabled
          ctx.scale(flipHorizontal, flipVertical); // Flip the image
        }
        ctx.rotate((rotate * Math.PI) / 180); // Rotate the image
        ctx.drawImage(img, -img.width / 2, -img.height / 2); // Draw the image
        ctx.resetTransform(); // Reset the transformation matrix
      };
    }
  }, [image, brightness, contrast, saturation, grayscale, flipHorizontal, flipVertical, rotate]); // Re-run the effect whenever the image, brightness, contrast, saturation, grayscale, flipHorizontal, flipVertical, or rotate changes

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    const reader = new FileReader(); // Create a new file reader
    reader.onloadend = () => { // When the file is loaded
      setImage(reader.result); // Set the image
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  };

  const downloadImage = () => {
    const canvas = canvasRef.current; // Get the canvas element
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement('a'); // Create a download link
    link.href = image; // Set the href of the link
    link.download = 'edited-image.png'; // Set the filename
    link.click(); // Trigger the download
  };

  return (
    <div className="app">
      <h2>Quicker Photo Tune-Up V1.1 by Arad Okanin | aradokanin.com </h2>
      <input type="file" onChange={handleImageChange} />
      <div className="editor">
        {image && (
          <div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
            <div className="controls">
              <label>Brightness:</label>
              <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
              <label>Contrast:</label>
              <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} />
              <label>Saturation:</label>
              <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} />
              <label>Grayscale:</label>
              <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(e.target.value)} />
              <button onClick={() => setFlipHorizontal(flipHorizontal * -1)}>Flip H</button>
              <button onClick={() => setFlipVertical(flipVertical * -1)}>Flip V</button>
              <button onClick={() => setRotate((rotate + 90) % 360)}>Rotate</button>
              <button onClick={downloadImage}>Download</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; // Export the App component
