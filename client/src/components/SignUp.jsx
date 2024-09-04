import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";
import notebookUrl from "./notebook.svg";
import logoUrl from "./studyLogo.png";
import loadingAnimation from "./loading.json";
import loadingMainPageAnimation from "./loadingMainPage.json";
import Lottie from "lottie-react";

const SignUp = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMessageAnimation, setShowMessageAnimation] = useState(false);

  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.preventDefault();
    setShowMessageAnimation(true);
    setTimeout(() => {
      setShowMessageAnimation(false);
      navigate("/login");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("http://localhost:4545/api/user/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);

    setTimeout(() => {
      setLoading(false);
      if (data.status === 200) {
        dispatch({ type: "SIGNUP", payload: data }); 
        toast.success("Account created successfully!!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-gray-800 text-white rounded-md",
          bodyClassName: "text-purple-500 font-semibold",
          progressClassName: "bg-purple-700",
        });
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Sign up failed! Please try again.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-gray-800 text-white rounded-md",
          bodyClassName: "text-purple-500 font-semibold",
          progressClassName: "bg-purple-700",
        });
      }
    }, 4000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-gray-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-60"></div>

      {/* Floating shapes */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Additional shapes */}
        <div className="absolute bottom-0 right-0 w-[150px] h-[150px] bg-gradient-to-r from-purple-700 to-purple-500 opacity-50 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full p-6 bg-gray-900 flex items-center justify-between z-10">
        <img src={logoUrl} alt="StudyNest Logo" className="w-48 h-auto" />{" "}
        {/* Adjusted size */}
      </nav>

      {showMessageAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <Lottie
            animationData={loadingMainPageAnimation}
            loop={true}
            className="w-64 h-64"
          />
        </div>
      )}

      {/* Sign-up box */}
      <div className="absolute w-[400px] bg-gray-800 z-20 flex justify-center items-center p-10 rounded-xl shadow-lg top-1/2 transform -translate-y-1/2 left-[20%]">
        <div className="flex flex-col items-center gap-10 w-full">
          <h2 className="text-3xl text-purple-700 font-bold">
            Create an account
          </h2>
          <div className="flex flex-col gap-6 w-full">
            <div className="relative w-full">
              <input
                type="text"
                required
                value={username}
                placeholder="Username"
                onChange={(e) => setusername(e.target.value)}
                className="w-full bg-gray-700 border-none outline-none p-3 rounded-md text-white font-medium text-base"
              />
            </div>
            <div className="relative w-full">
              <input
                type="text"
                required
                value={email}
                placeholder="Email"
                onChange={(e) => setemail(e.target.value)}
                className="w-full bg-gray-700 border-none outline-none p-3 rounded-md text-white font-medium text-base"
              />
            </div>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="Password"
                onChange={(e) => setpassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-700 border-none outline-none p-3 rounded-md text-white font-medium text-base"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 pr-3 bg-transparent border-none cursor-pointer text-gray-500 text-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="relative w-full mb-2">
              <button
                type="submit"
                onClick={handleSubmit}
                className="relative w-full bg-purple-700 text-white font-semibold text-lg rounded-xl p-2 cursor-pointer hover:opacity-75"
              >
                {loading ? (
                  <div className=" inset-0 flex items-center justify-center">
                    <Lottie
                      animationData={loadingAnimation}
                      loop={true}
                      className="w-10 h-7"
                    />
                  </div>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
            <div className="flex justify-center cursor-pointer">
              <a className="text-white hover:text-purple-300 mr-2">
                Already have an account?
              </a>
              <a
                className="text-purple-500 font-semibold hover:text-purple-300"
                onClick={handleNavigate}
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating SVG */}
      <div className="absolute w-1/2 h-full right-0 flex items-center justify-center p-10">
        <img
          src={notebookUrl}
          alt="Notebook"
          className="w-3/4 h-auto rounded-lg animate-float"
        />
      </div>
    </section>
  );
};

export default SignUp;
