import React, { useState, useEffect } from 'react';

function UploadForm({ onResult, onShowImage }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }
    };
  }, [currentPreviewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setFile(null);
    setStatus('');
    onResult(null);

    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
    }
    setCurrentPreviewUrl(null);
    onShowImage(null);


    if (selectedFile) {
      setFile(selectedFile);

      const newPreviewUrl = URL.createObjectURL(selectedFile);
      setCurrentPreviewUrl(newPreviewUrl);
      onShowImage(newPreviewUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('Getting upload URL...');
    const fileType = file.type;

    try {
      // Step 1: Get the presigned URL from your API
      const getUrlResponse = await fetch(
        `https://8npixumcfg.execute-api.us-east-1.amazonaws.com/Live/get-upload-url?type=${encodeURIComponent(fileType)}`
      );
      if (!getUrlResponse.ok) throw new Error('Failed to get upload URL');
      const { uploadUrl, key } = await getUrlResponse.json();

      setStatus('Uploading image...');

      // Step 2: Upload the file data to S3 using the presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': fileType },
        body: file,
      });
      if (!uploadResponse.ok) throw new Error('Image upload failed');

      setStatus('Processing...');

      // Step 3: Call the detect-labels endpoint with the bucket and generated key
      const detectResponse = await fetch(
        'https://8npixumcfg.execute-api.us-east-1.amazonaws.com/Live/detect-labels',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bucket: 'image-labeling-api-georgewallden',
            key: key,
          }),
        }
      );
      if (!detectResponse.ok) throw new Error('Label detection failed');

      const data = await detectResponse.json();
      onResult(data);
      setStatus('');

    } catch (err) {
      setStatus('Error: ' + err.message);
      onResult(null);
    }
  };

  return (
    <div className="upload-form">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <p className="upload-hint">Upload your image here</p>
      <button
        onClick={handleUpload}
        disabled={!file || status.startsWith('Uploading') || status.startsWith('Processing')}
      >
        {status.startsWith('Uploading') || status.startsWith('Processing') ? status : 'Submit'}
      </button>
      <p className="upload-status">
        {status && !status.startsWith('Uploading') && !status.startsWith('Processing') ? status : ''}
      </p>
    </div>
  );
}

export default UploadForm;