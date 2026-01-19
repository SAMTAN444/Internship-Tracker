import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      onAuth?.();
      navigate("/dashboard", { replace: true });
      toast.success("Successfully Logged In");
    } catch (error) {
      toast.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-teal-500 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-400">Loading dashboard…</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center min-h-screen bg-white dark:bg-gray-900 px-3 md:px-4">
        <div className="container mx-auto max-w-md">
          <div className="max-w-md mx-auto my-10">
            <div className="text-center">
              <h1 className="my-3 text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200">
                Log In
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Log In to access to your account
              </p>
            </div>

            <div className="my-7">
              <form onSubmit={handleSubmit}>
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
                    className="input-dark w-full px-3 py-2"
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
                      className="w-full px-3 py-2 input-dark"
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
                    className="w-full px-3 py-4 text-white bg-teal-600 rounded-md hover:bg-teal-500 focus:outline-none"
                  >
                    Log In
                  </button>
                </div>

                <p className="text-sm text-center text-gray-400">
                  Don&apos;t have an account yet?{" "}
                  <a
                    href="/register"
                    className="text-teal-600 hover:underlin hover:text-teal-500"
                  >
                    Sign up
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
