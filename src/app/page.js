"use client"
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [imageData, setImageData] = useState(null);
  const [chatResponse, setChatResponse] = useState(null);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      const video = document.createElement('video');
      document.body.appendChild(video);
      video.srcObject = stream;

      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Data = canvas.toDataURL('image/jpeg');
      setImageData(base64Data);

      video.srcObject.getTracks().forEach(track => track.stop());
      document.body.removeChild(video);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleFileSelect = async (event) => {
    try {
      const file = event.target.files[0];

      if (!file) {
        console.error('No file selected.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setImageData(base64Data);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  const handleSend = async () => {
    try {
      if (!imageData) {
        console.error('No image data available.');
        return;
      }

      const response = await axios.post('https://swa3p4ickqt523o7c3am5tdege0iplck.lambda-url.us-east-1.on.aws/', {
        base64: imageData.split(',')[1],
      });

      setChatResponse(response.data.response);

      // Clear image data
      setImageData(null);
    } catch (error) {
      console.error('Error calling the API:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Image to API</h1>

      <div className="flex mb-4">
        <button onClick={handleCapture} className="bg-blue-500 text-white p-2 rounded">
          📷 Capture Image
        </button>
        <input type="file" accept="image/*" onChange={handleFileSelect} className="ml-2" />
        {imageData && (
          <button onClick={handleSend} className="bg-green-500 text-white p-2 rounded ml-2">
            Send
          </button>
        )}
      </div>

      {imageData && (
        <div className="bg-gray-200 p-4 rounded text-black text-md text-medium">
          {/* Display captured image */}
          <img src={imageData} alt="Captured" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}

      {chatResponse && (
        <div className="bg-gray-200 p-4 rounded text-black text-md text-medium mt-4">
          {chatResponse}
        </div>
      )}
    </div>
  );
}
