import React from "react";
import { IoClose, IoSend } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import ChatContainer from "./ChatContainer";

const Channels = () => {
  return (
    <div className="p-3 h-full mr-1">
      <div className="flex space-x-1 h-full">
        {/* Channels List */}
        <div className="flex-none w-1/5 bg-gray-800 p-4 ml-0 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-8 mt-4">
              Public Discussions
            </h2>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Channels..."
                className="w-full p-2 rounded-md text-sm bg-gray-700 text-white  placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-purple-500"
              />
            </div>

            {/* Channels list would go here */}
          </div>

          {/* Create Channel Button */}
          <div className="mt-auto ">
            <button className="w-full p-2  text-white bg-purple-800 mb-2 hover:bg-purple-700 rounded-md shadow-md">
              Create Channel
            </button>
          </div>
        </div>

        {/* Channels Content */}
        <ChatContainer />
      </div>
    </div>
  );
};

export default Channels;
