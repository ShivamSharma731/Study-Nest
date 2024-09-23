import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

// Initialize socket outside the component to reuse the same connection
const socket = io("http://localhost:4545", { withCredentials: true });

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notebooks, setNotebooks] = useState([]);
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Similar to the Channels example, we'll listen for notebooks on mount and when a notebook is added
  useEffect(() => {
    // Fetch notebooks on component mount
    socket.emit("getNotebooks");

    // Listen for 'notebookList' event to update notebooks
    socket.on("notebookList", (data) => {
      setNotebooks(data);
    });

    // Also listen for any updates, such as when a new notebook is created
    socket.on("newNotebookAdded", (notebook) => {
      setNotebooks((prevNotebooks) => [...prevNotebooks, notebook]);
    });

    // Clean up the socket listeners to prevent memory leaks
    return () => {
      socket.off("notebookList");
      socket.off("newNotebookAdded");
    };
  }, []); // Empty dependency array ensures this only runs once on mount

  // Handle adding a new notebook
  const handleAddNotebook = () => {
    if (newNotebookTitle.trim() === "") return;

    const newNotebook = { title: newNotebookTitle };
    socket.emit("createNotebook", newNotebook); // Emit event to create a new notebook

    setNewNotebookTitle("");
    setIsPopupOpen(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-[98vh] p-4 bg-gray-950 text-white rounded-lg">
      {/* Main Content Section */}
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-400 ml-3">
            My Notebooks
          </h1>
          <button
            className="bg-purple-800 text-sm hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg"
            onClick={() => setIsPopupOpen(true)}
          >
            Add Notebook
          </button>
        </div>

        {/* Combined Right Div and Sidebar */}
        <div className="flex mt-4">
          {/* Expandable Right Div */}
          <div className={`flex-grow h-[90vh] bg-gray-800 rounded-lg p-4`}>
            {/* Additional content can go here */}
          </div>

          {/* Notebook List Sidebar */}
          <div
            className={`bg-gray-800 rounded-lg p-2 ${
              !isPopupOpen ? "ml-2 mr-2" : ""
            } flex flex-col transition-all duration-500 ease-in-out ${
              isSidebarVisible ? "w-1/5 opacity-100" : "w-0 opacity-0"
            }`}
          >
            {isSidebarVisible && (
              <>
                <h2 className="text-xl font-bold text-purple-400 "></h2>
                <div className="mb-4 mt-4">
                  <input
                    type="text"
                    placeholder="Search your notebooks..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-2 pl-6 rounded-2xl text-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:ring-indigo-500"
                  />
                </div>
                <ul className="mt-2 flex-grow overflow-y-auto">
                  {notebooks
                    .filter((notebook) =>
                      notebook.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((notebook) => (
                      <li
                        key={notebook._id}
                        className="bg-gray-700 p-2 rounded-lg mb-2 text-white"
                      >
                        {notebook.title}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>

          {/* Toggle Icon for Sidebar */}
          <div
            className="flex items-center hover:bg-gray-900 p-2 rounded-lg cursor-pointer"
            onClick={toggleSidebar}
          >
            {isSidebarVisible ? (
              <MdOutlineKeyboardDoubleArrowLeft className="cursor-pointer text-purple-400 text-xl" />
            ) : (
              <MdOutlineKeyboardDoubleArrowRight className="cursor-pointer text-purple-400 text-xl" />
            )}
          </div>
        </div>
      </div>

      {/* Popup for Adding Notebook */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-white mb-4">New Notebook</h2>
            <input
              type="text"
              placeholder="Enter notebook title..."
              value={newNotebookTitle}
              onChange={(e) => setNewNotebookTitle(e.target.value)}
              className="w-full p-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:ring-indigo-500 mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-purple-800 text-sm hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg mr-2"
                onClick={handleAddNotebook}
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
    </div>
  );
};

export default Notes;
