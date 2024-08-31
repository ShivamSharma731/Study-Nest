import React, { useState, useEffect } from "react";
import ChatContainer from "./ChatContainer";
import io from "socket.io-client";
import { logo } from "../../assets/images.js";
import EmptyContainer from "./EmptyContainer";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:4545");

const Channels = () => {
  const [channelList, setChannelList] = useState([]);
  const [hasChats, setHasChats] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Emit the 'getChannels' event to fetch the channel list
    const fetchChannels = () => {
      socket.emit("getChannels");
    };

    fetchChannels(); // Fetch channels when the component mounts

    // Listen for the channel list from the server
    socket.on("channelList", (channels) => {
      setChannelList(channels);
    });

    // Cleanup to prevent memory leaks
    return () => {
      socket.off("channelList");
    };
  }, [location.pathname]); // Re-run the effect whenever the route changes

  const handleCreateChannel = () => {
    const channelName = prompt("Enter the name for the new channel:");
    if (channelName) socket.emit("createChannel", channelName);
  };

  // Handle selecting a channel
  const handleSelectChannel = (channel) => {
    setHasChats(true);
    setSelectedChannel(channel);
  };

  // Handle going back to the channel list
  const handleBackButton = () => {
    setHasChats(false);
    setSelectedChannel(null);
  };

  return (
    <div className="p-3 h-full mr-1">
      <div className="flex space-x-1 h-full">
        {/* Channels List */}
        <div className="flex-none w-1/5 bg-gray-800 p-4 ml-0 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-8 mt-4">
              Public Channels
            </h2>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Channels..."
                className="w-full p-2 rounded-md text-sm bg-gray-700 text-white  placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-purple-500"
              />
            </div>

            {/* Channels list */}
            <div className="flex flex-col space-y-0 text-sm border-2 rounded-lg border-gray-900 custom-scrollbar h-128">
              {channelList.map((channel) => (
                <button
                  key={channel._id}
                  onClick={() => handleSelectChannel(channel)}
                  className={`w-full text-left p-2 text-white ${
                    selectedChannel === channel ? "bg-gray-700" : "bg-gray-800"
                  }   hover:bg-gray-700  shadow-md flex items-center space-x-4 transition duration-300  border-b-2 border-gray-900`}
                >
                  {/* Display Picture */}
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={logo}
                      className="w-full h-full object-cover"
                      alt="Channel Logo"
                    />
                  </div>

                  {/* Channel Name */}
                  <span className=" font-semibold">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Create Channel Button */}
          <div className="">
            <button
              className="w-full p-2 text-gray-200 bg-purple-800  rounded-md border border-purple-900 hover:bg-purple-700 transition-colors duration-200 font-bold"
              onClick={handleCreateChannel}
            >
              Create Channel
            </button>
          </div>
        </div>

        {/* Channels Content */}
        {hasChats ? (
          <ChatContainer
            onBackButtonClick={handleBackButton}
            channel={selectedChannel}
          />
        ) : (
          <EmptyContainer />
        )}
      </div>
    </div>
  );
};

export default Channels;
