import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../hooks/useAuthContext";

const SignUp = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
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
    // localStorage.setItem("user", JSON.stringify(data.token));
    console.log(data);
    
    dispatch({ type: "SIGNUP", payload: data });        // update auth

    if (data.status === 200) {
      navigate("/home");
    }
  };

  return (
    <section className="body">
      {/* Background effect */}
      {[...Array(200)].map((_, index) => (
        <span key={index}></span>
      ))}

      <div className="signin">
        <div className="content">
          <h2>SignUp</h2>
          <div className="form">
            <div className="inputBox">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setusername(e.target.value)}
              />
              <i>Username</i>
            </div>
            <div className="inputBox">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <i>Email</i>
            </div>
            <div className="inputBox">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <i>Password</i>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="links">
              <a href="#">Already have an account?</a>
              <a href="#" onClick={handleNavigate}>
                Login
              </a>
            </div>
            <div className="inputBox">
              <input type="submit" value="SignUp" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
