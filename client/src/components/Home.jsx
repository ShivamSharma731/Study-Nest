import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { PiChatsBold } from "react-icons/pi";
import { GoGoal } from "react-icons/go";
import { CgNotes } from "react-icons/cg";
import { FaRobot } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa";

const Home = () => {
  const { dispatch, state } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showText, setShowText] = useState(false);

  const menus = [
    { name: "Dashboard", link: "/", icon: MdOutlineDashboard },
    { name: "Solo Study", link: "/", icon: IoBookSharp },
    { name: "Channels", link: "/", icon: PiChatsBold },
    { name: "Study Goals", link: "/", icon: GoGoal },
    { name: "Notes", link: "/", icon: CgNotes },
    { name: "Ask AI", link: "/", icon: FaRobot },
    { name: "News", link: "/", icon: FaRegNewspaper },
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:4545/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      dispatch({ type: "LOGOUT" });
      if (res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error while logging out: ", error);
    }
  };

  const handleMouseEnter = () => {
    setSidebarOpen(true);
    setTimeout(() => setShowText(true), 300); // Delay the text display until the sidebar opens
  };

  const handleMouseLeave = () => {
    setShowText(false);
    setSidebarOpen(false);
  };

  return (
    <div className="flex gap-6 bg-gray-800">
      <div
        className={`bg-[#0e0e0e] min-h-screen text-purple-700 px-3 ${
          sidebarOpen ? "w-64" : "w-16"
        } duration-500`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
        <div className="flex flex-col gap-5 mt-16 relative text-xl">
          {menus.map((menu, i) => (
            <Link
              to={menu.link}
              key={i}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 group"
            >
              <div>{React.createElement(menu.icon, { size: "20" })}</div>
              {sidebarOpen && showText && (
                <div
                  style={{ transitionDelay: `${i + 3}00ms` }}
                  className="text-sm font-bold text-white whitespace-pre duration-500 translate-x-4 "
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
      </div>
      <div className="flex-1 p-6">{/* This section is for main content */}</div>
    </div>
  );
};

export default Home;
