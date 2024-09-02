import React, { useEffect, useRef, useState } from "react";

const DashBoard = () => {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const userListRef = useRef(null);

  useEffect(() => {
    // Fetch logged-in user's data
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:4545/api/user/userId", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch all users' data
    const fetchUserList = async () => {
      try {
        const response = await fetch("http://localhost:4545/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const users = await response.json();
        setUserList(users);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchUserData();
    fetchUserList();
  }, []);

  const handleOutsideClick = (e) => {
    if (userListRef.current && !userListRef.current.contains(e.target)) {
      setShowUserList(false);
    }
  };

  useEffect(() => {
    if (showUserList) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showUserList]);

  const handleToggleUserList = () => {
    setShowUserList(!showUserList);
  };

  return (
    <div className="w-full h-screen bg-gray-950 text-white p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="bg-gray-950 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-purple-600">
          {username}
        </div>
      </div>

      <div className="flex ">
        {/* Main Content */}
        <div className="flex-1">
          {/* Add your main dashboard content here */}
        </div>

        {/* Users List (conditionally rendered) */}
        {showUserList && (
          <div
            className="w-1/6 bg-gray-800 p-4 rounded-lg ml-6"
            ref={userListRef}
          >
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-purple-400">Users</h2>
              <button
                className="text-white font-bold text-3xl px-2 py-1 rounded"
                onClick={() => setShowUserList(false)}
              >
                -
              </button>
            </div>

            <ul className="space-y-2 custom-scrollbar">
              {userList.map((user) => (
                <li
                  key={user._id}
                  className="bg-gray-700 p-2 text-xs rounded-md text-white flex justify-between items-center"
                >
                  {user.username}
                  <button className="text-green-500 font-bold">+</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Add Friends Button at Bottom Right */}
      {!showUserList && (
        <button
          className="absolute bottom-6 right-6 p-2   text-2xl text-gray-900 pl-3 pb-3 pr-3 bg-purple-800 rounded-full border border-purple-900 hover:bg-purple-700 transition-colors duration-200 font-bold"
          onClick={handleToggleUserList}
        >
          +
        </button>
      )}
    </div>
  );
};

export default DashBoard;
