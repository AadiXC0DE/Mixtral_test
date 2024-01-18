"use client"
import { useState } from 'react';
import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const client = new MistralClient(apiKey);

export default function Home() {
  const [input, setInput] = useState('');
  const [chatResponse, setChatResponse] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Call Mistral API
      const response = await client.chat({
        model: 'mistral-small',
        messages: [{ role: 'user', content: "You are a helpful tutor, give answers to the questions in brief and deduce final answer step wise, find the closest answer, also write the final answer explicitly with the option" }],
        messages: [{ role: 'user', content: input }],
        temperature: 0.2,
        stream: true,

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
        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </div>

      {chatResponse && (
        <div className="bg-gray-200 p-4 rounded text-black text-md text-medium">
          {chatResponse}
        </div>
      )}
    </div>
  );
}
