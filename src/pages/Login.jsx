import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginApi } from "../api/authApi";

import "../styles/login.css";

import logo from "../assets/logo.png";

export default function Login() {

  const nav = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async (e) => {
    e.preventDefault();

    try {

      const res =
        await loginApi({
          email,
          password,
        });

      localStorage.setItem(
        "token",
        res.data.token
      );

      nav("/dashboard");

    } catch {

      alert("Login failed");

    }

  };

  return (

    <div className="login-page">

      <div className="login-wrapper">
        
        {/* LEFT */}

        <div className="login-left">
     
        <div className="brand-box">
          <img src={logo} 
          className="brand-logo"
          />
    
   <div className="brand-title">
      Document Tracker
    </div>

    <div className="brand-sub">
      TRANSPORT DEPARTMENT
    </div>

 </div>
        </div>


        {/* RIGHT */}

        {/* <div className="login-right"> */}
        {/* <div> */}
        <form
  className="login-right"
  onSubmit={login}
>

          <h3>Sign In</h3>

          <input
            placeholder="Email"
            onChange={(e)=>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>
              setPassword(e.target.value)
            }
          />
{/* 
          <button onClick={login}>
            Login
          </button> */}

          <button type="submit">
  Login
</button>

       </form>

      </div>

    </div>

  );
}