"use client";
import { useState, useEffect, useRef } from "react";
import MistralClient from "@mistralai/mistralai";
import { CameraIcon } from "@heroicons/react/solid"; // Importing camera icon
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Cropper from "react-cropper";

import "cropperjs/dist/cropper.css";

import Image from "next/image";
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const client = new MistralClient(apiKey);

export default function Home() {
  const [input, setInput] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const previewCanvasRef = useRef();
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const cropperRef = useRef();
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    console.log(cropper.getCroppedCanvas().toDataURL());
  };
  const handleCrop = () => {
    console.log("Cropping initiated");
    if (image) {
      const cropper = cropperRef.current?.cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      console.log("I m croppedCanvas", croppedCanvas);
      const dataUrl = croppedCanvas.toDataURL();
      setCroppedImage(dataUrl);
      console.log("dataUrl hu", dataUrl);
      console.log("croppedImage v yahi hai", croppedImage);
    }
  };

  useEffect(() => {
    if (croppedImage) {
      console.log("Cropped Image hu", croppedImage);
    }
  }, [croppedImage]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async () => {
    const text = "";
    try {
      // Call Mistral API
      // const response = await client.chat({
      //   model: 'mistral-small',
      //   'messages': [{'role': 'user', 'content': `You are a helpful tutor, write in simple Latex language in proper format (showing all symbols properly) to the questions in brief and deduce final answer step wise, find the closest answer if options are given. Question: {}${input}`}],
      //   temperature: 0.3,
      // });
      // Set chat response
      // setChatResponse(response.choices[0].message.content);
      // Clear input
      // setInput('');
    } catch (error) {
      console.error("Error calling Mistral API:", error);
    }
  };
  // @Adi Do what ever u wish to do with this cropped image
  const logBase64Data = () => {
    if (croppedImage) {
      console.log("Base64 Data:", croppedImage.split(",")[1]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Chat with Mistral AI</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="border p-2 flex-grow text-black mr-2"
          placeholder="Type your question..."
        />
        <label className="relative cursor-pointer bg-blue-500 text-white p-2 rounded">
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <span className="flex items-center">
            <CameraIcon className="h-5 w-5 mr-1" />
            Upload
          </span>
        </label>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Submit
        </button>
      </div>

      {image && (
        <div>
          {image && (
            <div>
              <Cropper
                src={image}
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={16 / 9}
                guides={true}
                crop={onCrop}
                ref={cropperRef}
              />
              <button onClick={handleCrop}>Crop</button>
            </div>
          )}

          {croppedImage && (
            <div>
              <h3>Cropped Image Preview</h3>
              <Image
                width={300}
                height={200}
                src={croppedImage}
                alt="Cropped"
                style={{ maxWidth: "100%", maxHeight: 400 }}
              />

              <canvas ref={previewCanvasRef} width={300} height={200}></canvas>
            </div>
          )}
        </div>
      )}

      {chatResponse && (
        <div className="bg-gray-200 p-4 rounded text-black text-md text-medium">
          <Latex>{chatResponse}</Latex>
        </div>
      )}
    </div>
  );
}
