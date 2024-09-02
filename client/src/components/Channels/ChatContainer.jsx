import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import io from "socket.io-client";
import { logo } from "../../assets/images.js";

const socket = io("http://localhost:4545");

const ChatContainer = ({ channel, onBackButtonClick }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const messageEndRef = useRef(null);

  // scroll the messages to the end
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, channel]);

  useEffect(() => {
    const getUserIdAndUsername = async () => {
      try {
        const response = await fetch("http://localhost:4545/api/user/userId", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to get user data");
        }

        const data = await response.json();
        setUserId(data.userId);
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserIdAndUsername();
  }, []);

  useEffect(() => {
    if (channel) {
      // Join the channel's room
      socket.emit("joinChannel", channel._id);

      // Fetch initial messages for the selected channel
      socket.emit("fetchMessages", channel._id);

      // Listen for messages when initially joining
      socket.on("channelMessages", (fetchedMessages) => {
        setMessages(fetchedMessages);
      });

      // Listen for new messages in real-time
      socket.on("newMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      socket.off("channelMessages");
      socket.off("newMessage");
    };
  }, [channel]);

  const handleSendMessage = () => {
    if (message.trim() && userId) {
      const newMessage = {
        channelId: channel._id,
        content: message,
        senderId: userId,
        username: username,
      };

      socket.emit("sendMessage", newMessage);

      setMessage("");
    }
  };

  return (
    <div className="flex-1 bg-gray-800 p-1 rounded-lg shadow-md flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-0 mt-0 p-2 pt-4 pb-2 border-gray-700 border-b-2 bg-gray-800">
        <div className="flex items-center space-x-4 gap-3">
          <button
            className="text-white hover:text-gray-400"
            onClick={onBackButtonClick}
          >
            <IoMdArrowRoundBack size={24} />
          </button>
          {/* Channel DP */}
          <img
            src={logo}
            className="w-6 h-6 rounded-full mr-8 scale-150 object-cover"
          />
          {/* Channel Name */}
          <h2 className="text-lg font-semibold text-white ">{channel.name}</h2>
        </div>
        <div className="flex items-center space-x-4">
          {/* Join Button */}
          <button className="px-4 py-2 text-sm text-white rounded-md bg-purple-800 mb-2 hover:bg-purple-700 mr-3 font">
            Join
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex-col text-white text-xs font-semibold bg-gray-900 border-r-4 border-l-4 p-3 border-l-gray-800 border-r-gray-800 overflow-hidden custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`w-fit max-w-xs p-3 rounded-lg mb-2 break-words ${
              msg.sender === userId
                ? "bg-purple-900 text-right ml-auto self-end"
                : "bg-gray-700 text-left mr-auto self-start"
            }`}
          >
            {msg.sender !== userId && (
              <div className="font-semibold mb-1 text-purple-500">
                @ {msg.username}
              </div>
            )}
            <div>{msg.content}</div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-2   pr-4 pl-2 rounded border-gray-500 bg-gray-900 pb-4 flex items-center border-l-4 border-l-gray-800 border-r-4 border-r-gray-800 border-b-4 border-b-gray-800">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
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
