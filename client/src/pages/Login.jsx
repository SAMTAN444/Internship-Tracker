import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-120 w-full">
            <a href="javascript:void(0)"><img src={logo} alt="logo" className="w-40 mb-8 mx-auto block" /></a>
        </div>
      </div>
    </>
  );
}
