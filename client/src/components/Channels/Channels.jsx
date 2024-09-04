import React, { useState, useEffect } from "react";
import ChatContainer from "./ChatContainer";
import EmptyContainer from "./EmptyContainer";
import Lottie from "react-lottie";
import io from "socket.io-client";
import { logo } from "../../assets/images.js";
import { useLocation } from "react-router-dom";
import messageAnimation from "./messageAnimation.json"; // Import your animation JSON file
import ChannelCreator from "./ChannelCreator.jsx";

const socket = io("http://localhost:4545");

const Channels = () => {
  const [channelList, setChannelList] = useState([]);
  const [hasChats, setHasChats] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [showChannelCreator, setShowChannelCreator] = useState(false); // State to show/hide channel creator
  const location = useLocation();

  useEffect(() => {
    const fetchChannels = () => {
      socket.emit("getChannels");
    };

    fetchChannels(); // Fetch channels when the component mounts

    socket.on("channelList", (channels) => {
      setChannelList(channels);
    });

    return () => {
      socket.off("channelList");
    };
  }, [location.pathname]);

  const searchChannels = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:4545/searchChannels?query=${query}`
      );
      const channels = await response.json();
      setChannelList(channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const handleCreateChannelClick = () => {
    setShowChannelCreator(true); // Show the channel creator
  };

  const handleSelectChannel = (channel) => {
    setHasChats(true);
    setSelectedChannel(channel);
    setShowChatContainer(false);

    setTimeout(() => {
      setShowChatContainer(true);
    }, 800);
  };

  const handleBackButton = () => {
    setHasChats(false);
    setSelectedChannel(null);
    setShowChatContainer(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      searchChannels(query);
    } else {
      socket.emit("getChannels");
    }
  };

  const handleCloseChannelCreator = () => {
    setShowChannelCreator(false); // Hide the channel creator
  };

  return (
    <div className="p-3 h-full mr-1">
      <div className="flex space-x-1 h-full">
        <div className="flex-none w-1/5 bg-gray-800 p-4 ml-0 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-purple-400 mb-8 mt-4">
              Study Groups
            </h2>

            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Groups..."
                className="w-full p-2 rounded-md text-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col space-y-0 text-sm border-2 rounded-lg border-gray-900 custom-scrollbar h-128">
              {channelList.map((channel) => (
                <button
                  key={channel._id}
                  onClick={() => handleSelectChannel(channel)}
                  className={`w-full text-left p-2 text-white ${
                    selectedChannel === channel ? "bg-gray-700" : "bg-gray-800"
                  } hover:bg-gray-700 shadow-md flex items-center space-x-4 transition duration-300 border-b-2 border-gray-900`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={logo}
                      className="w-full h-full object-cover"
                      alt="Channel Logo"
                    />
                  </div>

                  <span className="font-semibold truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              className="w-full p-2 text-gray-200 bg-purple-800 rounded-md border border-purple-900 hover:bg-purple-700 transition-colors duration-200 font-bold"
              onClick={handleCreateChannelClick}
            >
              Create Group
            </button>
          </div>
        </div>

        {hasChats && !showChatContainer ? (
          <div className="flex-1 flex items-center justify-center bg-gray-900 rounded-lg">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: messageAnimation,
              }}
              height={300}
              width={300}
            />
          </div>
        ) : showChatContainer ? (
          <ChatContainer
            onBackButtonClick={handleBackButton}
            channel={selectedChannel}
          />
        ) : (
          <EmptyContainer />
        )}
      </div>

      {/* Conditionally render the ChannelCreator */}
      {showChannelCreator && (
        <ChannelCreator socket={socket} onClose={handleCloseChannelCreator} />
      )}
    </div>
  );
};

export default Channels;
