import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

export default function Register({ onAuth }) {
  const [username, setUsername] = useState("");
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
        username,
        password,
      });
      localStorage.setItem("token", data.token);
      onAuth?.();
      navigate("/dashboard", { replace: true });
      toast.success("Account created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-600">Creating your account…</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center min-h-screen bg-white px-4">
        <div className="container mx-auto max-w-md">
          <div className="max-w-md mx-auto my-10">
            <div className="text-center">
              <h1 className="my-3 text-2xl font-semibold text-gray-900">
                Register
              </h1>
              <p className="text-gray-600">
                Register to create an account
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
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      seterror("");
                    }}
                    className="w-full px-3 py-2 input-dark"
                    required
                  />
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

                <div className="mb-6">
                  <label
                    htmlFor="confirmpassword"
                    className="block mb-2 text-sm text-gray-600"
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
                    Register
                  </button>
                </div>

                <p className="text-sm text-center text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-gray-900 underline hover:text-gray-700"
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
