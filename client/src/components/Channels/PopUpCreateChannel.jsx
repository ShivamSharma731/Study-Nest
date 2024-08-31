import React, { useState } from "react";

const PopUpCreateChannel = ({ isOpen, onClose, onCreate }) => {
  const [channelName, setChannelName] = useState("");

  const handleSubmit = () => {
    if (channelName.trim()) {
      onCreate(channelName);
      setChannelName(""); // Clear input after submission
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">Create New Channel</h2>
        <input
          type="text"
          placeholder="Enter channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md"
        />
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-800 text-white rounded-md"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpCreateChannel;
