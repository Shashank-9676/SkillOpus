import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BookOpen } from "lucide-react";
import StatCard from "./StarCard";
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
      // setLoading(true); // Don't trigger full reload on update
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back,{" "}
                <span className="text-blue-600">{userDetails.username}</span>!
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Track your progress and continue learning.
              </p>
            </motion.div>
          </div>
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
            color="bg-blue-500"
          />
          {/* Add more stats here if available, e.g., Completed Courses, Certificates */}
        </motion.div>

        {/* My Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
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
