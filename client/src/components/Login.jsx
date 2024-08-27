import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../Context/authContext";
const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { authenticated } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleNavigate = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/home");
    }
  }, [authenticated, navigate]);

  const handlesubmit = async (e) => {
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
    // localStorage.setItem("user", JSON.stringify(data));
    console.log(data);
    if (data.status === 200) {
      e.preventDefault();
      navigate("/home");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(
        "http://localhost:4545/api/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), 
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Handle success (e.g., show a toast message)
        console.log(result.message);
      } else {
        // Handle error (e.g., show an error message)
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    //check your mail - toast
  };

  return (
    <section className="body">
      {/* Background effect */}
      {[...Array(200)].map((_, index) => (
        <span key={index}></span>
      ))}

      <div className="signin">
        <div className="content">
          <h2>Login</h2>
          <div className="form">
            <div className="inputBox">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <i>Username or email</i>
            </div>
            <div className="inputBox pass">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />

              <i>Password</i>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="links">
              <a className="forgot" onClick={handleForgotPassword}>
                Forgot Password ?
              </a>
              <a onClick={handleNavigate}>Signup</a>
            </div>
            <div className="inputBox">
              <input type="submit" value="Login" onClick={handlesubmit} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
