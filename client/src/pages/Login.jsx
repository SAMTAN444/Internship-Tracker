import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

export default function Login({ onAuth }) {
  const [username, setUsername] = useState("");
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
        username,
        password,
      });
      localStorage.setItem("token", data.token);
      onAuth?.();
      navigate("/dashboard", { replace: true });
      toast.success("Successfully Logged In");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-600">Loading dashboard…</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center min-h-screen bg-white px-3 md:px-4">
        <div className="container mx-auto max-w-md">
          <div className="max-w-md mx-auto my-10">
            <div className="text-center">
              <h1 className="my-3 text-2xl md:text-3xl font-semibold text-gray-900">
                Log In
              </h1>
              <p className="text-gray-600">
                Log In to access to your account
              </p>
            </div>

            <div className="my-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-dark w-full px-3 py-2"
                  ></input>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm text-gray-600"
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
                 text-gray-600 text-sm hover:text-gray-900"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 mb-4 p-3 text-sm
                  text-red-700
                  bg-red-50
                  rounded-md"
                  >
                    <HiExclamationCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full px-3 py-4 text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none"
                  >
                    Log In
                  </button>
                </div>

                <p className="text-sm text-center text-gray-600">
                  Don&apos;t have an account yet?{" "}
                  <a
                    href="/register"
                    className="text-gray-900 underline hover:text-gray-700"
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
