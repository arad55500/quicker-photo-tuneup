import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  const [rotate, setRotate] = useState(0);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (flipHorizontal !== 1 || flipVertical !== 1) {
          ctx.scale(flipHorizontal, flipVertical);
        }
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.resetTransform();
      };
    }
  }, [image, brightness, contrast, saturation, grayscale, flipHorizontal, flipVertical, rotate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement('a');
    link.href = image;
    link.download = 'edited-image.png';
    link.click();
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

export default App;
