import React from "react";

const Channels = () => {
  return (
    <div className="p-3 h-full mr-1">
      <div className="flex space-x-3 h-full">
        {/* Channels List */}
        <div className="flex-none w-1/4 bg-gray-700 p-4 ml-1 rounded-lg shadow-md flex justify-center">
          <h2 className="text-xl font-semibold mb-4"></h2>
        </div>

        {/* Channels Content */}
        <div className="flex-1 bg-gray-700 p-4 rounded-lg shadow-md flex justify-center">
          <h2 className="text-xl font-semibold mb-4 "></h2>
        </div>
      </div>
    </div>
  );
};

export default Channels;
