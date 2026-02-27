import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BookOpen, Users } from "lucide-react";
import StatCard from "./StatCard";
import CourseCard from "./CourseCard";
import { useAuth } from "../context/AuthContext";
import EmptyView from "./EmptyView";
import SyncLoader from "react-spinners/SyncLoader";
import { motion } from "framer-motion";

const InstructorDashboard = () => {
  const { userDetails } = useAuth();
  const [instructorStats, setInstructorStats] = useState({});
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
    try {
      // setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/instructor/${userDetails.id}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
        },
      );
      const data = await response.json();
      setMyCourses(data.details || []);
    } catch (error) {
      //   toast.error("Error fetching courses")
      console.error("Error fetching courses:", error);
    }
  };

  const fetchInstructorStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stats/instructor/${userDetails.id}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
        },
      );
      const data = await response.json();
      setInstructorStats(data.details || {});
    } catch (error) {
      console.error("Error fetching instructor stats:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchMyCourses(), fetchInstructorStats()]);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16">
      {/* ── Gradient Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-600">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 rounded-full bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-purple-100 text-sm font-medium mb-1 uppercase tracking-widest">
              Instructor Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Hello, {userDetails?.username || "Instructor"}! 🎓
            </h1>
            <p className="text-purple-100 mt-2 text-base">
              View your assigned courses and track student progress.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <StatCard
            icon={BookOpen}
            title="Assigned Courses"
            value={instructorStats?.totalCourses || 0}
            color="purple"
          />
          <StatCard
            icon={Users}
            title="Total Students"
            value={instructorStats?.totalStudents || 0}
            color="indigo"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Assigned Courses
              </h2>
            </div>

            {myCourses.length === 0 ? (
              <EmptyView />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myCourses.map((course, index) => (
                  <motion.div
                    key={course._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <CourseCard
                      course={course}
                      onCourseUpdate={fetchMyCourses}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
