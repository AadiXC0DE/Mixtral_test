"use client";
import { useState, useEffect, useRef } from "react";
import { CameraIcon } from "@heroicons/react/solid";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Cropper from "react-cropper";
import axios from "axios";
import Loader from "./components/Loader";

import "cropperjs/dist/cropper.css";

import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [imageInput, setImageInput] = useState("");
  const [question, setQuestion] = useState(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [loading, setLoading] = useState(false); //loader
  const previewCanvasRef = useRef();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleImageInputChange = (e) => {
    setImageInput(e.target.value);
  };

  const cropperRef = useRef();
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
  };

  //cropping image
  const handleCrop = () => {
    setShowTextInput(true);
    if (image) {
      const cropper = cropperRef.current?.cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      const dataUrl = croppedCanvas.toDataURL();
      setCroppedImage(dataUrl);
    }
  };

  useEffect(() => {
    if (croppedImage) {
      console.log("Cropped Image", croppedImage);
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
      setLoading(true);
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
      setQuestion(input);
      setChatResponse(response.data.answer);

      // Clear input
      setInput("");
    } catch (error) {
      console.error("Error calling Mistral API:", error);
    } finally{
      setLoading(false);
    }
  };
  //dicretly converting to base64 in handleImageSend

  //submitting image
  const handleImageSend = async () => {
    try {
      setImage(null);
      setLoading(true);
      if (!croppedImage) {
        console.error("No image data available.");
        return;
      }

      const base64Data = croppedImage.split(",")[1];

      const response = await axios.post(
        "https://swa3p4ickqt523o7c3am5tdege0iplck.lambda-url.us-east-1.on.aws/",
        {
          base64: base64Data,
          image_context: showTextInput ? imageInput : " ",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setQuestion(response.data.question);
      setChatResponse(response.data.answer);
      setShowTextInput(false);
    } catch (error) {
      console.error("Error calling the API:", error);
    } finally{
      setLoading(false);
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
            className={`${loading ? 'bg-slate-200' : 'bg-yellow-300'} ${loading ? 'text-gray-400' : 'text-black'}  ${!loading && 'hover:bg-yellow-400 hover:scale-105'} ml-2 p-2 rounded mb-2 sm:ml-2 sm:mb-0`}
          >
            Submit
          </button>
          <button
            onClick={handleImageSend}
            className={`${loading ? 'bg-slate-200' : 'bg-yellow-300'} ${loading ? 'text-gray-400' : 'text-black'}  ${!loading && 'hover:bg-yellow-400 hover:scale-105'} ml-2 p-2 rounded mb-2 sm:ml-2 sm:mb-0`}
          >
            Submit Image
          </button>
        </div>

        {showTextInput && (
          <div className="flex flex-col">
            <h1 className="font-medium text-black">Enter query for image...</h1>
          <input
            type="text"
            value={imageInput}
            onChange={handleImageInputChange}
            className="border bg-yellow-100 text-black p-2 mb-2 flex-grow"
            placeholder="Type your question for and click Submit Image..."
          />
          </div>
        )}

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

        {loading && <Loader />}

        {question && (
          <div className="bg-yellow-100 pt-4 pl-4 pr-4 pb-2 rounded text-black text-md font-medium">
            <Latex>{`Q: ${question}`}</Latex>
          </div>
        )}

        {chatResponse && (
          <div className="bg-yellow-50 p-4 rounded text-black text-md">
            <p className="font-medium">Answer:</p>
            <Latex>{chatResponse}</Latex>
          </div>
        )}
      </div>
    </div>
  );
}
