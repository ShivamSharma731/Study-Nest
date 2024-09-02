import React from "react";
import Lottie from "react-lottie";
import chatAnimation from "./chatAnimation.json";

const EmptyContainer = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: chatAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex-1 bg-gray-950 p-0 rounded-lg shadow-md flex flex-col items-center justify-center border-4  border-gray-800 ">
      {/* Animation and Content */}
      <div className="flex flex-col items-center">
        {/* Animation */}
        <div className="mb-4">
          <Lottie
            options={defaultOptions}
            height={180}
            width={180}
            className="text-purple-400"
          />
        </div>

        {/* Content */}
        <p className="text-gray-500">
          No messages to display. Please select a channel to start chatting.
        </p>
      </div>
    </div>
  );
};

export default EmptyContainer;
