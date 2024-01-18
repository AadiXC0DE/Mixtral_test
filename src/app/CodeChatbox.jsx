"use client";
import React, { useState } from "react";
import { TextField, Button, IconButton, Box } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Loader from "./Loader";
import OpenAI from "openai";

// Additional styles (if needed)
// ...

export const runtime = "edge";

const CodeChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({apiKey:"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",dangerouslyAllowBrowser: true});

  const handleSendMessage = async (messageToSend = inputValue) => {
    if (typeof messageToSend !== "string") {
      console.error("handleSendMessage expects a string, but received:", messageToSend);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "text", content: messageToSend, isResponse: false },
      { type: "text", content: "", isResponse: true }, // Placeholder for AI's response
    ]);

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content" : "Hello, I am your AI tutor. I can help you with your doubts"},
          {"role": "user", "content": messageToSend}
        ],
        stream: true,
      });

      let aiResponse = "";
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          aiResponse += chunk.choices[0]?.delta?.content;
          // eslint-disable-next-line no-loop-func
          setMessages((prevMessages) => {
            let newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { type: "text", content: aiResponse, isResponse: true };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "text", content: `Error sending message: ${error.message}`, isResponse: true },
      ]);
    }

    setInputValue("");
  };



  const convertTextToSpeech = (text) => {
    const url =
      "https://api.elevenlabs.io/v1/text-to-speech/m1PPA5234IAlWAK51PcE";
    const headers = {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": "5395c1b9978581680cd3250f76387cd4",
    };
    const data = {
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    };

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="p-4 md:max-w-3xl max-h-xl max-w-xl lg:max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Any Questions?</h1>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        className="flex items-center"
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type your question here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 bg-slate-100 mr-8"
        />
        <Button
          variant="contained"
          className="text-black px-1 ml-6 bg-slate-400 rounded-md"
          onClick={() => handleSendMessage()}
        >
          ASK
        </Button>
      </Box>
      {/* Messages display */}
      <div className="overflow-y-auto lg:h-[18rem] md:h-[18rem] h-auto bg-white  bg-cover rounded p-4 mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 flex ${message.isResponse ? 'flex-row-reverse items-end' : 'items-start'}`}>
            {message.type === "image" ? (
              <>
                <img
                  src={message.content}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded"
                />
                <div className="flex items-center mt-2">
                  <div className={`bg-gray-100 rounded text-black p-2 ${message.isResponse ? 'rounded-l-lg' : 'rounded-r-lg'}`}>
                    {message.response}
                  </div>
                  <IconButton onClick={() => convertTextToSpeech(message.response)}>
                    <VolumeUpIcon />
                  </IconButton>
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <div className={`bg-gray-100 rounded text-black p-2 ${message.isResponse ? 'rounded-l-lg' : 'rounded-r-lg'}`}>
                  {message.content}
                </div>
                {message.isResponse && (
                  <IconButton onClick={() => convertTextToSpeech(message.content)}>
                    <VolumeUpIcon />
                  </IconButton>
                )}
                {!message.isResponse && (
                  <img
                    src="/profile.png" // Replace with actual profile picture path
                    alt="User"
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && <Loader />}
      </div>

    </div>
  );
};

export default CodeChatbot;