import React, { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);


  // sending email to the server
  const handleSendOtp = async () => {
    try {
      const response = await fetch("http://localhost:4545/api/user/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        setOtpSent(true); 
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVerifyOtp = async () => {
    // Call API to verify the OTP
    try {
      const response = await fetch("http://localhost:4545/api/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        // Handle successful OTP verification (e.g., navigate to the next step)
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="flex flex-col h-screen w-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute w-[400px] bg-gray-800 z-20 flex justify-center items-center p-10 rounded-xl shadow-lg top-1/2 transform -translate-y-1/2 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-10 w-full">
          <h2 className="text-3xl text-purple-700 font-bold">Verify Your Email</h2>
          <div className="flex flex-col gap-6 w-full">
            {/* Email Input */}
            <div className="relative w-full">
              <input
                type="text"
                required
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border-none outline-none p-3 rounded-md text-white font-medium text-base"
              />
            </div>

            {/* Send OTP Button */}
            <div className="relative w-full">
              <input
                type="button"
                value="Send OTP"
                onClick={handleSendOtp}
                className="w-full bg-purple-700 text-black font-semibold text-lg rounded-xl p-3 cursor-pointer hover:opacity-75"
              />
            </div>

            {/* OTP Input */}
            {otpSent && (
              <>
                <div className="relative w-full">
                  <input
                    type="text"
                    required
                    value={otp}
                    placeholder="Enter the OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-gray-700 border-none outline-none p-3 rounded-md text-white font-medium text-base"
                  />
                </div>

                {/* Verify OTP Button */}
                <div className="relative w-full">
                  <input
                    type="button"
                    value="Verify OTP"
                    onClick={handleVerifyOtp}
                    className="w-full bg-purple-700 text-black font-semibold text-lg rounded-xl p-3 cursor-pointer hover:opacity-75"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
