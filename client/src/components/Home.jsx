import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";

const Home = () => {
  const { dispatch, state } = useAuthContext();

  const menus = [
    { name: "Dashboard", link: "/", icon: MdOutlineDashboard },
    { name: "Solo Study", link: "/", icon: AiOutlineUser },
    { name: "Channels", link: "/", icon: FiMessageSquare },
    { name: "Study Goals", link: "/", icon: AiOutlineUser },
    { name: "Notes", link: "/", icon: AiOutlineUser },
    { name: "Ask AI", link: "/", icon: AiOutlineUser },
    { name: "News", link: "/", icon: AiOutlineUser },
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

  return (
    <div className="flex gap-6 bg-gray-800">
      <div className="bg-[#0e0e0e] min-h-screen w-72 text-purple-700 px-5">
        <div className="py-3 flex justify-end">
          <HiMenuAlt3 size={26} className="cursor-pointer" />
        </div>
        <div className="flex flex-col gap-5 mt-16 relative text-xl ">
          {menus.map((menu, i) => (
            <Link to={menu.link} key={i} className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-md ">
              <div>{React.createElement(menu.icon, { size: "20" })}</div>
              <h2 className="text-sm text-white">{menu.name}</h2>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        {" "}
        {/* This section is for main content */}
      </div>
    </div>
  );
};

export default Home;
