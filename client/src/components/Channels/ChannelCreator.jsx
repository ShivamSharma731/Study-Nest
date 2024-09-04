import React, { useState } from "react";

const ChannelCreator = ({ socket, onClose }) => {
  const [channelName, setChannelName] = useState("");

  const handleCreateChannel = () => {
    if (channelName) {
      socket.emit("createChannel", channelName);
      setChannelName(""); // Clear the input after creating the channel
      onClose(); // Close the creator UI after creating the channel
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreateChannel();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <h2 className="text-xl text-white font-semibold mb-4">
          Create a New Channel
        </h2>
        <input
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          onKeyDown={handleKeyDown} // Handle the keyDown event
          placeholder="Enter channel name"
          className="w-full p-2 mb-4 text-white bg-gray-800 border rounded-md"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="p-2 bg-gray-500 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateChannel}
            className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-500"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelCreator;
