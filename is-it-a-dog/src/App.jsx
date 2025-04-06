import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import ResultBox from './components/ResultBox';
import './App.css'; // Import the CSS file

function App() {
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  return (
    <div className="app-container">
      <h1>🐶 Is it a Dog?</h1>
      <t>Use Amazon Rekognition to see if a dog is in your photo!</t>
      <UploadForm onResult={setResult} onShowImage={setImageUrl} />
      {imageUrl && (
        <div className="image-preview-container">
          <img src={imageUrl} alt="Uploaded preview" className="uploaded-image" />
        </div>
      )}
      {result && <ResultBox result={result} />}
    </div>
  );
}

export default App;