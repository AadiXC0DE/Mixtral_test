"use client"
import { useState } from 'react';
import MistralClient from '@mistralai/mistralai';
import { CameraIcon } from '@heroicons/react/solid'; // Importing camera icon
import { MathJax } from 'better-react-mathjax';
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'



const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const client = new MistralClient(apiKey);

export default function Home() {
  const [input, setInput] = useState('');
  const [chatResponse, setChatResponse] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    const text=""
    try {
      // Call Mistral API
      const response = await client.chat({
        model: 'mistral-small',
        'messages': [{'role': 'user', 'content': `You are a helpful tutor, write in simple Latex language in proper format (showing all symbols properly) to the questions in brief and deduce final answer step wise, find the closest answer if options are given. Question: {}${input}`}],
        temperature: 0.3,

      });

      // Set chat response
      setChatResponse(response.choices[0].message.content);

      // Clear input
      setInput('');
    } catch (error) {
      console.error('Error calling Mistral API:', error);
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
          <input
            type="file"
            className="hidden"
          />
          <span className="flex items-center">
            <CameraIcon className="h-5 w-5 mr-1" />
            Upload
          </span>
        </label>
        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded ml-2">
          Submit
        </button>
      </div>

      {chatResponse && (
        <div className="bg-gray-200 p-4 rounded text-black text-md text-medium">
           <Latex>{chatResponse}</Latex>
        </div>
      )}


    </div>

  );
}
