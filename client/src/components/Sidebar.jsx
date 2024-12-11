import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { PiChatsBold } from "react-icons/pi";
import { GoGoal } from "react-icons/go";
import { CgNotes } from "react-icons/cg";
import { FaRobot } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { BiSolidVideos } from "react-icons/bi";
import { useAuthContext } from "../hooks/useAuthContext";
import logoUrl from "./studyLogo.png";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    userId: "",
  });
  const location = useLocation();
  const { dispatch, user } = useAuthContext();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:4545/api/user/userId", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          username: data.username,
          email: data.email,
          userId: data.userId,
        });
      } else {
        console.log("Failed to fetch user data");
      }
    } catch (error) {
      console.log("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4545/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.log("Error while logging out: ", error);
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      const timeoutId = setTimeout(() => setContentVisible(true), 300);
      return () => clearTimeout(timeoutId);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      setContentVisible(false);
    }
  }, [sidebarOpen]);

  const menus = [
    { name: "DashBoard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "Study Rooms", link: "/study-room", icon: BiSolidVideos },
    { name: "Study Groups", link: "/channels", icon: PiChatsBold },
    { name: "Study Goals", link: "/study-goals", icon: GoGoal },
    { name: "Notes", link: "/notes", icon: CgNotes },
    { name: "Ask AI", link: "/ask-ai", icon: FaRobot },
    { name: "Blogs", link: "/news", icon: FaRegNewspaper },
  ];

  // Close sidebar on menu item click
  const handleMenuItemClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`bg-gray-900 h-screen fixed top-0 left-0 text-purple-700 px-3 ${
        sidebarOpen ? "w-64" : "w-16"
      } duration-500 flex flex-col z-50`}
    >
      <div className="flex items-start justify-between py-3 mb-6">
        {sidebarOpen && (
          <div className="flex flex-col mt-3 pl-2 text-left">
            <span></span>
          </div>
        )}
        <HiMenuAlt3
          size={26}
          className="cursor-pointer ml-2 mt-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      <div className="flex flex-col gap-5 mt-16 flex-grow relative text-xl">
        {menus.map((menu, i) => (
          <Link
            to={menu.link}
            key={i}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 group ${
              location.pathname === menu.link
                ? "bg-gray-700 text-white"
                : "text-gray-400"
            }`}
            onClick={handleMenuItemClick} // Close sidebar on item click
          >
            <div className="text-purple-400">
              {React.createElement(menu.icon, { size: "20" })}
            </div>
            {sidebarOpen && contentVisible && (
              <div
                style={{ transitionDelay: `${i + 3}00ms` }}
                className="text-sm font-bold whitespace-pre duration-500 translate-x-4"
              >
                {menu.name}
              </div>
            )}
            {!sidebarOpen && (
              <span
                className="absolute left-14 bg-gray-300 font-semibold text-gray-900 rounded-md drop-shadow-lg px-2 py-0.5 text-xs w-fit overflow-hidden group-hover:block hidden group-hover:left-14"
                style={{
                  whiteSpace: "nowrap",
                  zIndex: 50,
                }}
              >
                {menu.name}
              </span>
            )}
          </Link>
        ))}
      </div>
      <div className="mt-auto py-3 px-0 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 pr-36 pl-2 pt-2 pb-2 rounded-md p-2  group"
        >
          <IoLogOut size={26} className="text-purple-500" />
          {sidebarOpen && contentVisible && (
            <div
              style={{ transitionDelay: `${menus.length + 3}00ms` }}
              className="text-sm whitespace-pre duration-500 translate-x-4 text-gray-400 font-extrabold"
            >
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
