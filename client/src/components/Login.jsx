import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../Context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notebookUrl from "./notebook4.svg";
import logoUrl from "./studyLogo.png";
import Lottie from "lottie-react";
import loadingAnimation from "./loading.json";
import mainPageLoading from "./loadingMainPage.json";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard");
    }
  }, [authenticated, navigate]);

  const handleNavigate = (e) => {
    e.preventDefault();
    setShowAnimation(true);
    setTimeout(() => {
      navigate("/signup");
      setShowAnimation(false);
    }, 1000);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4545/api/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      setTimeout(() => {
        setLoading(false);

        if (data.status === 200) {
          toast.success("Login successful!", {
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
          toast.error(
            data.message || "Login failed! Please check your credentials.",
            {
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
            }
          );
        }
      }, 4000);
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlesubmit(e);
    }
  };

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-gray-950">
      <ToastContainer />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-60"></div>

      {/* Floating shapes */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[150px] h-[150px] bg-gradient-to-r from-purple-700 to-purple-500 opacity-50 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full p-6 bg-gray-900 flex items-center justify-between z-10">
        <img src={logoUrl} alt="StudyNest Logo" className="w-48 h-auto" />{" "}
        {/* Adjusted size */}
        <div className="text-white font-semibold mr-6"></div>
      </nav>

      {/* Floating SVG */}
      <div className="absolute w-1/2 h-full left-0 flex items-center justify-center p-10">
        <img
          src={notebookUrl}
          alt="Notebook"
          className="w-3/5 h-auto rounded-lg animate-float"
        />
      </div>
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <Lottie
            animationData={mainPageLoading}
            loop={true}
            className="w-64 h-64"
          />
        </div>
      )}

      {/* Login box */}
      <div className="absolute w-[400px] bg-gray-800 mr-10 z-20 flex justify-center items-center p-10 rounded-xl shadow-lg top-1/2 transform -translate-y-1/2 right-[15%]">
        <div className="flex flex-col items-center gap-6 w-full">
          <h2 className="text-3xl text-purple-700 font-bold mb-4">
            Welcome Back
          </h2>
          <div className="flex flex-col gap-6 w-full">
            <div className="relative w-full">
              <input
                type="text"
                required
                value={email}
                placeholder="Email or username"
                onChange={(e) => setemail(e.target.value)}
                onKeyDown={handleKeyDown}
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
            <div className="flex justify-between w-full mb-4">
              <a
                className="text-white ml-1 text-sm hover:text-purple-300 cursor-pointer"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative w-full mb-2">
              <button
                type="submit"
                onClick={handlesubmit}
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
                  "Login"
                )}
              </button>
            </div>
            <div className="flex justify-center items-center w-full">
              <span className="text-gray-300 mr-2 text-sm">
                Don't have an account?
              </span>
              <a
                className="text-purple-500 cursor-pointer font-semibold hover:text-purple-300"
                onClick={handleNavigate}
              >
                Signup
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
