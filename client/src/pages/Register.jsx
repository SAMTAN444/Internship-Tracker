import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    setloading(true);
    seterror("");

    try {
      const { data } = await API.post("/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
      toast.success("Successfully Logged In")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <div className="flex items-center min-h-screen bg-white dark:bg-gray-900 px-4">
        <div className="container mx-auto max-w-md">
          <div className="max-w-md mx-auto my-10">
            <div className="text-center">
              <h1 className="my-3 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Register
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Register to create an account
              </p>
            </div>

            <div className="my-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      seterror("");
                    }}
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  ></input>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-gray-400 text-sm hover:text-gray-200"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmpassword"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmpassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmpassword}
                      onChange={(e) => setconfirmpassword(e.target.value)}
                      className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-gray-400 text-sm hover:text-gray-200"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 mb-4 p-3 text-sm 
                                  text-red-400 
                                  bg-red-500/10 
                                  rounded-md"
                  >
                    <HiExclamationCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full px-3 py-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none"
                  >
                    Register
                  </button>
                </div>

                <p className="text-sm text-center text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-indigo-500 hover:underlin hover:text-indigo-600"
                  >
                    Log In
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
