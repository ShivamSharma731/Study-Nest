import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useLocation } from "react-router-dom";
import { SlNotebook } from "react-icons/sl";
import { IoSave } from "react-icons/io5";

// Initialize socket outside the component to reuse the same connection
const socket = io("http://localhost:4545", { withCredentials: true });

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [notesContent, setNotesContent] = useState("");
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [notebookTitle, setNotebookTitle] = useState("My Notebooks");
  const [prevNotebookTitle, setPrevNotebookTitle] = useState("");
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch notebooks on component mount
    socket.emit("fetchNotebooks");

    socket.on("notebookList", (data) => {
      setNotebooks(data);
    });

    socket.on("newNotebookAdded", (notebook) => {
      setNotebooks((prevNotebooks) => [...prevNotebooks, notebook]);
    });

    return () => {
      socket.off("notebookList");
      socket.off("newNotebookAdded");
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsSidebarVisible(false);
      }
    };

    if (isSidebarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarVisible]);

  const fetchNotebooks = () => {
    socket.emit("fetchNotebooks");
  };

  const handleAddNotebook = () => {
    if (newNotebookTitle.trim() === "") return;

    const newNotebook = { title: newNotebookTitle };
    socket.emit("createNotebook", newNotebook);
    setNewNotebookTitle("");
    setIsPopupOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNotebookClick = (notebook) => {
    setPrevNotebookTitle(notebookTitle); // Store the current title before changing
    setNotebookTitle(notebook.title); // Update the title to the selected notebook
    setSelectedNotebook(notebook);
    setIsSidebarVisible(false);

    // Fetch notes data for the selected notebook
    socket.emit("fetchNotes", notebook._id);

    socket.on("notesData", (notes) => {
      setNotesContent(notes.content || "");
    });
  };

  const handleNotesChange = (e) => {
    setNotesContent(e.target.value);
  };

  const saveNotes = () => {
    if (selectedNotebook) {
      const updatedNotes = {
        notebookId: selectedNotebook._id,
        content: notesContent,
      };
      socket.emit("saveNotes", updatedNotes);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => {
      if (!prev) {
        fetchNotebooks();
      }
      return !prev;
    });
  };

  return (
    <div className="flex h-[98vh] p-4 bg-gray-950 text-white rounded-lg">
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h1
            className={`text-2xl font-bold text-purple-400 ml-3 transition-all duration-500`}
          >
            {notebookTitle}
          </h1>
          <button
            className="bg-purple-800 text-sm hover:bg-purple-700 text-white font-semibold py-2 px-3 mr-16 rounded-lg"
            onClick={() => setIsPopupOpen(true)}
          >
            Add Notebook
          </button>
        </div>

        <div className="flex mt-4">
          <div className="flex-grow h-[90vh] bg-gray-800 rounded-lg p-1">
            {selectedNotebook ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  {/* <button
                    className="text-purple-600 font-semibold p-2 rounded-lg ml-auto"
                    onClick={saveNotes}
                  >
                    <IoSave size={20} />
                  </button> */}
                </div>

                <textarea
                  className="w-full h-[80vh] bg-gray-800 text-white rounded-lg p-3 focus:outline-none"
                  value={notesContent}
                  onChange={handleNotesChange}
                  placeholder="Start taking notes ....."
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-xl">
                  Select a notebook to start writing notes...
                </p>
              </div>
            )}
          </div>

          <div
            ref={sidebarRef}
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
                <ul className="mt-2 flex-grow overflow-y-auto text-sm rounded-md bg-gray-800 p-3">
                  {notebooks
                    .filter((notebook) =>
                      notebook.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((notebook) => (
                      <li
                        key={notebook._id}
                        className="text-white py-2 p-2 flex items-center hover:bg-gray-700 hover:rounded-md cursor-pointer"
                        onClick={() => handleNotebookClick(notebook)}
                      >
                        <SlNotebook className="mr-6 text-purple-400 font-bold size-5" />
                        {notebook.title}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>

          <div
            ref={toggleButtonRef}
            className="flex items-center hover:bg-gray-900 p-2 rounded-lg cursor-pointer"
            onClick={toggleSidebar}
          >
            {isSidebarVisible ? (
              <MdOutlineKeyboardDoubleArrowRight className="cursor-pointer text-purple-400 text-xl" />
            ) : (
              <MdOutlineKeyboardDoubleArrowLeft className="cursor-pointer text-purple-400 text-xl" />
            )}
          </div>
        </div>
      </div>

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
