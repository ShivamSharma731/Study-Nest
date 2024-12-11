import React, { useState, useEffect, useRef } from "react";
import {
  Send as SendIcon,
  Bot as BotIcon,
  User as UserIcon,
} from "lucide-react";

const Askai = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Replace with your actual OpenAI API key
  const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

  const sendMessage = async () => {
    if (message.trim()) {
      // Add user message
      const userMessage = {
        user: "You",
        message,
        type: "user",
      };
      
      setChat((prevChat) => [...prevChat, userMessage]);
      setMessage("");
      setIsLoading(true);

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system", 
                content: "You are a helpful assistant. Keep your responses concise and direct."
              },
              {
                role: "user", 
                content: message
              }
            ],
            max_tokens: 150
          })
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        const aiResponse = {
          user: "AI",
          message: data.choices[0].message.content.trim(),
          type: "ai",
        };

        setChat((prevChat) => [...prevChat, aiResponse]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
          user: "AI",
          message: "Sorry, there was an error processing your request.",
          type: "ai",
        };
        setChat((prevChat) => [...prevChat, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gray-800 p-4 flex items-center space-x-3">
          <BotIcon className="text-purple-500" size={30} />
          <h2 className="text-xl font-bold text-white">Ask AI</h2>
        </div>

        {/* Chat Window */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`
                flex items-start space-x-3 
                ${msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""}
              `}
            >
              <div
                className={`
                  p-3 rounded-xl max-w-[80%]
                  ${
                    msg.type === "user"
                      ? "bg-purple-700 text-white"
                      : "bg-gray-800 text-gray-300"
                  }
                `}
              >
                {msg.message}
              </div>
              <div className="shrink-0">
                {msg.type === "user" ? (
                  <UserIcon size={20} className="text-purple-400" />
                ) : (
                  <BotIcon size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start items-center space-x-3">
              <BotIcon size={20} className="text-gray-500" />
              <div className="bg-gray-800 p-3 rounded-xl">
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          )}

          {/* Scroll Anchor */}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 p-4 flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="
              flex-grow 
              bg-gray-900 
              text-white 
              rounded-full 
              px-4 
              py-2 
              focus:outline-none 
              focus:ring-2 
              focus:ring-purple-500
            "
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            className="
              bg-purple-700 
              text-white 
              rounded-full 
              p-2 
              hover:bg-purple-600 
              disabled:opacity-50 
              disabled:cursor-not-allowed 
              transition-colors
            "
          >
            <SendIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Askai;