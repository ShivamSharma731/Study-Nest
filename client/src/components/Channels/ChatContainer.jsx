import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";

const ChatContainer = () => {
  const [messages, setMessages] = useState([]); // State to store messages
  const [message, setMessage] = useState(""); // State to store the current input

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add the new message to the list of messages
      setMessages([...messages, message]);
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className="flex-1 bg-gray-900 p-0 rounded-lg shadow-md flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-0 mt-0 p-2 pt-4 pb-2 border-gray-700 border-b-2  bg-gray-800">
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-gray-400">
            <IoMdArrowRoundBack size={24} />
          </button>
          {/* Channel DP */}
          {/* <img
            src=""
            alt=""
            className="w-10 h-10 rounded-full bg-gray-800"
          /> */}
          {/* Channel Name */}
          <h2 className="text-lg font-semibold text-white">Channel Name</h2>
        </div>
        <div className="flex items-center space-x-4">
          {/* Join Button */}
          <button className="px-4 py-2 text-sm text-white rounded-md bg-purple-800 mb-2 hover:bg-purple-700 mr-3">
            Join
          </button>
          {/* Close Channel Icon */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-900 border-r-4 border-l-4 border-l-gray-800 border-r-gray-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-2 bg-gray-700 text-white rounded-md mb-2"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-2 pr-4 pl-2 border-gray-500 bg-gray-900 pb-4 flex items-center border-l-4 border-l-gray-800 border-r-4 border-r-gray-800 border-b-4 border-b-gray-800">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update state with the input value
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(); // Send message on Enter key press
            }
          }}
          className="flex-1 p-2 pl-4 rounded-md bg-[#48505ca3] text-white border-none border-gray-600 focus:outline-none focus:ring-0"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="ml-4 px-3 mb-1 py-2 bg-purple-600 text-xl text-white rounded-md hover:bg-blue-600"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
