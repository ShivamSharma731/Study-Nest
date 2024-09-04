import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notebookUrl from "./notebook4.svg";
import logoUrl from "./studyLogo.png";
import Lottie from "lottie-react";
import loadingAnimation from "./loading.json";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); 
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate the remaining time for the OTP
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4545/api/user/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success(data.message || "OTP verified successfully.", {
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
        toast.error(data.error || "Failed to verify OTP.", {
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
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred. Please try again later.");
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
        <img src={logoUrl} alt="StudyNest Logo" className="w-48 h-auto" />
      </nav>

      {/* Floating SVG */}
      <div className="absolute w-1/2 h-full left-0 flex items-center justify-center p-10">
        <img
          src={notebookUrl}
          alt="Notebook"
          className="w-3/5 h-auto rounded-lg animate-float"
        />
      </div>

      {/* Verify OTP Box */}
      <div className="absolute w-[400px] bg-gray-800 mr-10 z-20 flex justify-center items-center p-10 rounded-xl shadow-lg top-1/2 transform -translate-y-1/2 right-[15%]">
        <div className="flex flex-col items-center gap-6 w-full">
          <h2 className="text-3xl text-purple-700 font-bold mb-4">
            Verify OTP
          </h2>
          <div className="flex flex-col gap-6 w-full">
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-gray-700 border-none outline-none p-3 rounded-md text-white font-medium text-base"
              />
            </div>
            <div className="relative w-full">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                className="w-full bg-gray-700 border-none outline-none p-3 rounded-md text-white font-medium text-base"
              />
            </div>
            <div className="relative w-full mb-2">
              <button
                type="submit"
                onClick={handleVerifyOtp}
                className="relative w-full bg-purple-700 text-white font-semibold text-lg rounded-xl p-2 cursor-pointer hover:opacity-75"
                disabled={loading || timeLeft <= 0}
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
                  "Verify OTP"
                )}
              </button>
            </div>
            <div className=" text-white flex flex-row gap-2 justify-center mt-4">
              <p className="text-purple-500">Otp expires in :</p>{" "}
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtp;
