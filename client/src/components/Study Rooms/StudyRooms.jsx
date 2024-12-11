import React, { useState } from "react";
import {
  Lock as LockIcon,
  Globe as GlobalIcon,
  PlusCircle as CreateIcon,
  Users as GroupIcon,
} from "lucide-react";

const StudyRooms = () => {
  const [activeTab, setActiveTab] = useState("public");

  const publicRooms = [
    {
      name: "Python Programmers",
      participants: 24,
      topic: "Advanced Python Techniques",
      difficulty: "Intermediate",
    },
    {
      name: "Data Science Learners",
      participants: 36,
      topic: "Machine Learning Basics",
      difficulty: "Beginner",
    },
    {
      name: "React Developers",
      participants: 42,
      topic: "React Hooks & Performance",
      difficulty: "Advanced",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 flex items-center">
          <GroupIcon className="mr-4 text-purple-500" size={40} />
          Study Rooms
        </h1>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6 mb-12">
          <button
            onClick={() => setActiveTab("private")}
            className={`
              flex items-center space-x-2 py-3 px-6 rounded-lg transition-all duration-300
              ${
                activeTab === "private"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }
            `}
          >
            <LockIcon size={20} />
            <span>Create Private Room</span>
          </button>

          <button
            onClick={() => setActiveTab("public")}
            className={`
              flex items-center space-x-2 py-3 px-6 rounded-lg transition-all duration-300
              ${
                activeTab === "public"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }
            `}
          >
            <GlobalIcon size={20} />
            <span>Join Public Rooms</span>
          </button>
        </div>

        {/* Rooms Section */}
        {activeTab === "public" && (
          <div className="grid md:grid-cols-3 gap-6">
            {publicRooms.map((room, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 hover:border-purple-600 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-purple-400">
                    {room.name}
                  </h3>
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    {room.participants} Online
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 flex items-center">
                    <CreateIcon size={16} className="mr-2 text-purple-500" />
                    Topic: {room.topic}
                  </p>
                  <p className="text-gray-400">
                    Difficulty:
                    <span
                      className={`
                      ml-2 px-2 py-1 rounded-full text-xs
                      ${
                        room.difficulty === "Beginner"
                          ? "bg-green-600"
                          : room.difficulty === "Intermediate"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }
                    `}
                    >
                      {room.difficulty}
                    </span>
                  </p>
                </div>
                <button className="mt-4 w-full bg-purple-700 hover:bg-purple-600 py-2 rounded-lg transition-colors">
                  Join Room
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "private" && (
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Create Private Study Room
            </h2>
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                placeholder="Room Name"
                className="w-full bg-gray-800 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-purple-500"
              />
              <select className="w-full bg-gray-800 border-none rounded-lg py-3 px-4">
                <option>Select Topic</option>
                <option>Mathematics</option>
                <option>Computer Science</option>
                <option>Language Learning</option>
              </select>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 bg-gray-800 text-purple-500 focus:ring-purple-500"
                />
                <label>Make Room Password Protected</label>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg transition-colors">
                Create Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyRooms;
