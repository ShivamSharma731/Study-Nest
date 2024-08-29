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
import { useAuthContext } from "../hooks/useAuthContext";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "Solo Study", link: "/solo-study", icon: IoBookSharp },
    { name: "Channels", link: "/channels", icon: PiChatsBold },
    { name: "Study Goals", link: "/study-goals", icon: GoGoal },
    { name: "Notes", link: "/notes", icon: CgNotes },
    { name: "Ask AI", link: "/ask-ai", icon: FaRobot },
    { name: "News", link: "/news", icon: FaRegNewspaper },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`bg-gray-900 min-h-screen text-purple-700 px-3 ${
        sidebarOpen ? "w-64" : "w-16"
      } duration-500 flex flex-col`}
    >
      <div className="py-3 flex justify-end">
        <HiMenuAlt3
          size={26}
          className="cursor-pointer"
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
          >
            <div className="text-purple-400">
              {React.createElement(menu.icon, { size: "20" })}
            </div>
            {sidebarOpen && (
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
                style={{ whiteSpace: "nowrap" }}
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
          className={`flex items-center gap-2 pr-36 pl-2 pt-2 pb-2 rounded-md hover:bg-gray-800 group`}
        >
          <IoLogOut size={26} className="text-purple-500" />
          {sidebarOpen && (
            <div
              style={{ transitionDelay: `${menus.length + 3}00ms` }}
              className="text-sm  whitespace-pre duration-500 translate-x-4 text-gray-400 font-extrabold"
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
