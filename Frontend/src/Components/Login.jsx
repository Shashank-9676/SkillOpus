import { useState } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useNavigate, Navigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Header from "./Header.jsx";
import { motion } from "framer-motion";

const Login = () => {
  const { setUserDetails } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        },
      );
      const data = await response.json();
      if (response.ok) {
        Cookies.set("jwt_token", data.token, { expires: 7, path: "/" });
        const userDetailsObj = {
          id: data.details._id,
          username: data.details.username,
          email: data.details.email,
          role: data.details.user_type,
          organization: data.details.org_name,
        };
        Cookies.set("userDetails", JSON.stringify(userDetailsObj), {
          expires: 7,
          path: "/",
        });
        setUserDetails(userDetailsObj);
        navigate("/", { replace: true });
        toast.success(`Welcome back, ${data.details.username}!`);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Network error occurred.");
    }
  };

  if (Cookies.get("jwt_token") && Cookies.get("userDetails")) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-5xl flex overflow-hidden min-h-[500px] z-10"
        >
          {/* Left Side - Hero / Image */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative flex-col justify-between p-12 text-white">
            <div>
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md mb-8">
                <img src="/skillopus_logo.png" alt="Logo" className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Welcome back to SkillOpus.
              </h2>
              <p className="text-blue-100 text-lg">
                Pick up where you left off and continue your learning journey.
              </p>
            </div>

            {/* Abstract shapes */}
            <div className="absolute bottom-0 right-0 p-12 opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <path
                  fill="#FFFFFF"
                  d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.1,22.9,71.1,34.5C60.1,46.1,49.5,55.7,37.6,62.3C25.7,68.9,12.5,72.4,-0.4,73.1C-13.3,73.8,-26,71.8,-37.4,65.3C-48.8,58.8,-58.9,47.8,-66.6,35.3C-74.3,22.8,-79.6,8.8,-78.3,-4.7C-77,-18.2,-69.1,-31.2,-59.1,-41.8C-49.1,-52.4,-37.1,-60.6,-24.6,-68.8C-12.1,-77,0.9,-85.2,14.2,-84.8C27.5,-84.4,41.2,-75.4,44.7,-76.4Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white dark:bg-slate-800 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sign In
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 mt-1">
                    Please enter your details.
                  </p>
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3.5 mt-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                >
                  Sign In
                </motion.button>
              </form>

              <div className="mt-8 text-center text-sm">
                <p className="text-gray-500 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                  >
                    Need help? Contact support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
