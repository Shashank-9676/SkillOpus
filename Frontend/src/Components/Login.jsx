import { useState, useEffect } from "react";
import { User, Lock, Mail, Eye, EyeOff, Phone, Shield } from "lucide-react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import CustomSelect from "./CustomSelect.jsx";
import Header from "./Header.jsx";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { setUserDetails } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    organization_id: "",
    user_type: "student",
    secret_code: "",
  });

  const needsSecretCode = ["admin", "instructor"].includes(
    registerData.user_type,
  );

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/organizations`,
        );
        const data = await res.json();
        setOrganizations(data.details || []);
      } catch (err) {
        console.log("Error fetching organizations:", err);
      } finally {
        setLoadingOrgs(false);
      }
    };
    fetchOrganizations();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setError(null);
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
        setError(data.message || "Login failed");
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Network error occurred.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: registerData.username,
            email: registerData.email,
            contact: registerData.contact,
            password: registerData.password,
            organization_id: registerData.organization_id,
            user_type: registerData.user_type,
            secret_code: registerData.secret_code,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setError(null);
        setActiveTab("login");
        toast.success("Registration successful! Please login.");
        setLoginData((prev) => ({ ...prev, email: registerData.email }));
      } else {
        setError(data.message || "Registration failed");
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
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
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-5xl flex overflow-hidden min-h-[600px] z-10"
        >
          {/* Left Side - Hero / Image */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative flex-col justify-between p-12 text-white">
            <div>
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md mb-8">
                <img src="/skillopus_logo.png" alt="Logo" className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Start your learning journey today.
              </h2>
              <p className="text-blue-100 text-lg">
                Join thousands of students mastering new skills on SkillOpus.
              </p>
            </div>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-purple-600 bg-gray-200"
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                    backgroundSize: "cover",
                  }}
                ></div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-purple-600 bg-white text-purple-600 flex items-center justify-center text-xs font-bold">
                +2k
              </div>
            </div>

            {/* Abstract shapes */}
            <div className="absolute bottom-0 right-0 p-12 opacity-10">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFFFFF"
                  d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.1,22.9,71.1,34.5C60.1,46.1,49.5,55.7,37.6,62.3C25.7,68.9,12.5,72.4,-0.4,73.1C-13.3,73.8,-26,71.8,-37.4,65.3C-48.8,58.8,-58.9,47.8,-66.6,35.3C-74.3,22.8,-79.6,8.8,-78.3,-4.7C-77,-18.2,-69.1,-31.2,-59.1,-41.8C-49.1,-52.4,-37.1,-60.6,-24.6,-68.8C-12.1,-77,0.9,-85.2,14.2,-84.8C27.5,-84.4,41.2,-75.4,44.7,-76.4Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white dark:bg-slate-800 flex flex-col justify-center">
            <div className="flex justify-center mb-8 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl self-center">
              <button
                onClick={() => setActiveTab("login")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "login" ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700"}`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "register" ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700"}`}
              >
                Sign Up
              </button>
            </div>

            <div className="w-full max-w-sm mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                    onSubmit={handleLoginSubmit}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome Back!
                      </h3>
                      <p className="text-gray-500 dark:text-slate-400">
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
                          placeholder="Email"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-all"
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
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
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
                      className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                    >
                      Sign In
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                    onSubmit={handleRegisterSubmit}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Create Account
                      </h3>
                      <p className="text-gray-500">
                        Start your free trial today.
                      </p>
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        required
                        name="username"
                        type="text"
                        placeholder="Full Name"
                        value={registerData.username}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            username: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        required
                        name="contact"
                        type="tel"
                        minLength={10}
                        maxLength={10}
                        placeholder="Phone Number"
                        value={registerData.contact}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            contact: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          required
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm"
                          value={registerData.confirmPassword}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                        />
                      </div>
                    </div>
                    {/* Role Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Register as
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["student", "instructor", "admin"].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() =>
                              setRegisterData({
                                ...registerData,
                                user_type: role,
                                secret_code: "",
                              })
                            }
                            className={`py-2 rounded-xl text-sm font-semibold capitalize border transition-all ${
                              registerData.user_type === role
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Organization Code */}
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                      <input
                        type="password"
                        placeholder="Organization code (if required)"
                        value={registerData.secret_code}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            secret_code: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm"
                      />
                    </div>

                    {/* Organization */}
                    <div>
                      <CustomSelect
                        label="Select Organization"
                        loading={loadingOrgs}
                        options={organizations?.map((org) => ({
                          value: org._id,
                          label: org.name,
                        }))}
                        value={registerData.organization_id}
                        onChange={(value) =>
                          setRegisterData({
                            ...registerData,
                            organization_id: value,
                          })
                        }
                        Color="default"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition-all"
                    >
                      Create Account
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Need help?{" "}
                  <a href="/contact" className="text-blue-600 hover:underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
