import React, { useState, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalContent, setGoalContent] = useState("");

  const handleAddGoal = () => {
    if (newGoalTitle.trim() === "") return;

    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      content: "",
    };
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    setNewGoalTitle("");
    setIsPopupOpen(false);
  };

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
    setGoalContent(goal.content);
  };

  const saveGoalContent = () => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === selectedGoal.id
          ? { ...goal, content: goalContent }
          : goal
      )
    );
    setSelectedGoal(null);
  };

  const cancelEditing = () => {
    setSelectedGoal(null);
  };

  return (
    <div className="flex flex-col h-[98vh] p-4 bg-gray-950 text-white rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-400 ml-3">
          My Goals Board
        </h1>
        <button
          className="flex items-center bg-purple-800 text-sm hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg"
          onClick={() => setIsPopupOpen(true)}
        >
          <IoMdAdd className="mr-2" size={18} />
          Add Goal
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer"
            onClick={() => handleGoalClick(goal)}
          >
            <h2 className="text-lg font-semibold text-purple-400">
              {goal.title}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {goal.content.slice(0, 100) || "Click to add details..."}
            </p>
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-white mb-4">New Goal</h2>
            <input
              type="text"
              placeholder="Enter goal title..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              className="w-full p-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:ring-indigo-500 mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-purple-800 text-sm hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg mr-2"
                onClick={handleAddGoal}
              >
                Add
              </button>
              <button
                className="bg-gray-600 text-sm hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-lg"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedGoal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[80%]">
            <h2 className="text-lg font-bold text-white mb-4">
              {selectedGoal.title}
            </h2>
            <textarea
              value={goalContent}
              onChange={(e) => setGoalContent(e.target.value)}
              className="w-full h-60 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:ring-indigo-500 mb-4"
              placeholder="Write your goal details here..."
            />
            <div className="flex justify-end">
              <button
                className="bg-purple-800 text-sm hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg mr-2"
                onClick={saveGoalContent}
              >
                Save
              </button>
              <button
                className="bg-gray-600 text-sm hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-lg"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
