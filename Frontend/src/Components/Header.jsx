import { useState } from "react";
import { BarChart3, Menu, X, Mail, LogIn, LogOut, BookOpen, Users, Building2, } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const logout = async () => {
    Cookies.remove("userDetails", { path: "/" });
    Cookies.remove("jwt_token", { path: "/" });
    navigate("/login");
    window.location.reload();
  };

  const getNavItems = () => {
    const dashboardItem = { label: "Dashboard", icon: BarChart3, href: "/" };
    const coursesItem = {label: "All Courses",icon: BookOpen,href: "/courses",};
    const contactItem = { label: "Contact Us", icon: Mail, href: "/contact" };
    const aboutItem = { label: "About Us", icon: Users, href: "/about" };
    const orgItem = { label: "Organizations", icon: Building2, href: "/organizations" };

    if (!userDetails) {
      return [orgItem, aboutItem, contactItem];
    }

    return [dashboardItem, coursesItem, contactItem, aboutItem];    
  };

  const navItems = getNavItems();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50"
      onMouseLeave={() => setIsProfileOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={userDetails ? "/" : "/courses"}
              className="flex items-center space-x-3 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg"
              >
                <img
                  src="/skillopus_logo.png"
                  alt="SkillOpus"
                  className="w-8 h-8 rounded bg-white p-0.5"
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {userDetails?.organization ?? "SkillOpus"}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block font-medium tracking-wide">
                  Learning Management System
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="relative group px-4 py-2 rounded-lg"
                >
                  <span
                    className={`flex items-center space-x-2 relative z-10 transition-colors duration-200 ${isActive ? "text-blue-600" : "text-gray-600 group-hover:text-blue-600"}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-blue-50 rounded-lg -z-0"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {userDetails ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {userDetails.username
                      ? userDetails.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="hidden sm:block text-left px-2">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {userDetails.username}
                    </p>
                    <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">
                      {userDetails.role}
                    </p>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                      onMouseEnter={() => setIsProfileOpen(true)}
                      onMouseLeave={() => setIsProfileOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-900">
                          Signed in as
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {userDetails.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                          onClick={logout}
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <nav className="py-4 space-y-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl mx-2 transition-all ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                {!userDetails && (
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 mx-2 text-blue-600 bg-blue-50 rounded-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
