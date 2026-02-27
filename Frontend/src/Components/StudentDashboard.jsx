import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BookOpen } from "lucide-react";
import StatCard from "./StatCard";
import CourseCard from "./CourseCard";
import SyncLoader from "react-spinners/SyncLoader";
import { useAuth } from "../context/AuthContext";
import EmptyView from "./EmptyView";
import { motion, AnimatePresence } from "framer-motion";

const StudentDashboard = () => {
  const { userDetails } = useAuth();
  const [studentStats, setStudentStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);

  const fetchMyCourses = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/student/${userDetails.id}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
        },
      );
      const data = await response.json();
      setMyCourses(data.details || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stats/student/${userDetails.id}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
        },
      );
      const data = await response.json();
      setStudentStats(data.details || { totalCourses: 0 });
    } catch (error) {
      console.error("Error fetching student stats:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchMyCourses(), fetchStudentStats()]);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <SyncLoader color="#3B82F6" size={15} margin={5} />
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-widest">
              Student Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back, {userDetails.username}! 👋
            </h1>
            <p className="text-blue-100 mt-2 text-base">
              Track your progress and continue learning.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <StatCard
            icon={BookOpen}
            title="Enrolled Courses"
            value={studentStats.totalCourses}
            color="blue"
          />
        </motion.div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enrolled Courses
            </h2>
            {/* Could add search filter here */}
          </div>

          {!myCourses || myCourses.length === 0 ? (
            <EmptyView />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
            >
              {myCourses.map((course) => (
                <motion.div
                  key={course._id}
                  variants={itemVariants}
                  className="h-full"
                >
                  <CourseCard course={course} onCourseUpdate={fetchMyCourses} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
