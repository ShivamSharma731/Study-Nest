import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const Askai = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4545");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = async () => {
    if (message.trim() && socket) {
      const messageData = {
        content: message,
        senderId: "user", // You might want to replace this with actual user ID
        username: "User", // You might want to replace this with actual username
      };

      socket.emit("aiMessage", messageData);
      setChat((prevChat) => [...prevChat, { user: "You", message }]);
      setMessage("");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("aiResponse", (response) => {
        setChat((prevChat) => [
          ...prevChat,
          { user: "AI", message: response.content },
        ]);
      });
    }
  }, [socket]);

  return (
    <div className="askai-container">
      <h2>Ask AI</h2>
      <div className="chat-window">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.user === "You" ? "user" : "ai"} text-white`}
          >
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Askai;
