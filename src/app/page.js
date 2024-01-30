"use client";
import { useState, useEffect, useRef } from "react";
import MistralClient from "@mistralai/mistralai";
import { CameraIcon } from "@heroicons/react/solid";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Cropper from "react-cropper";
import axios from "axios";

import "cropperjs/dist/cropper.css";

import Image from "next/image";

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

  //cropping image
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
    try {
      // Call Lambda function
      const response = await axios.post(
        "https://swa3p4ickqt523o7c3am5tdege0iplck.lambda-url.us-east-1.on.aws/",
        {
          chatbot: `${input}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Set chat response
      setChatResponse(response.data);

      // Clear input
      setInput("");
    } catch (error) {
      console.error("Error calling Mistral API:", error);
    }
  };
  //dicretly converting to base64 in handleImageSend

  //submitting image
  const handleImageSend = async () => {
    try {
      if (!croppedImage) {
        console.error("No image data available.");
        return;
      }

      const base64Data = croppedImage.split(",")[1];

      const response = await axios.post(
        "https://swa3p4ickqt523o7c3am5tdege0iplck.lambda-url.us-east-1.on.aws/",
        {
          base64: base64Data,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      setChatResponse(response.data);

      setImage(null);
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-black mb-4">Doubt Solver</h1>

        <div className="flex flex-wrap mb-4">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="border bg-yellow-100 text-black p-2 flex-grow mb-2 sm:mr-2 sm:mb-0"
            placeholder="Type your question..."
          />
          <label className="relative cursor-pointer ml-2 bg-yellow-300 text-black p-2 rounded mb-2 sm:mb-0 flex items-center">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <CameraIcon className="h-5 w-5 mr-2" />
            Upload
          </label>
          <button
            onClick={handleSubmit}
            className="bg-yellow-300 text-black ml-2 p-2 rounded mb-2 sm:ml-2 sm:mb-0"
          >
            Submit
          </button>
          <button
            onClick={handleImageSend}
            className="bg-yellow-300 text-black ml-2 p-2 rounded mb-2 sm:ml-2 sm:mb-0"
          >
            Submit Image
          </button>
        </div>

        {image && (
          <div className="mb-4">
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
                <div className="flex justify-center">
                  {" "}
                  <button
                    onClick={handleCrop}
                    className="bg-white mt-2 w-36 font-bold text-lg text-black cursor-pointer hover:bg-blue-400 hover:text-white p-2 rounded"
                  >
                    Crop
                  </button>
                </div>
              </div>
            )}

            {croppedImage && (
              <div>
                <h3 className="text-xl mb-2">Cropped Image Preview</h3>
                <Image
                  width={300}
                  height={200}
                  src={croppedImage}
                  alt="Cropped"
                  style={{ maxWidth: "100%", maxHeight: 400 }}
                />

                <canvas
                  ref={previewCanvasRef}
                  width={300}
                  height={200}
                ></canvas>
              </div>
            )}
          </div>
        )}

        {chatResponse && (
          <div className="bg-yellow-50 p-4 rounded text-black text-md text-medium">
            <Latex>{chatResponse}</Latex>
          </div>
        )}
      </div>
    </div>
  );
}
