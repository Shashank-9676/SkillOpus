import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BookOpen, Users } from "lucide-react";
import StatCard from "./StarCard";
import CourseCard from "./CourseCard";
import { useAuth } from "../context/AuthContext";
import EmptyView from "./EmptyView";
import { toast } from "react-toastify";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <SyncLoader color="#3B82F6" size={15} margin={5} />
      </div>
    );
  }

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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Instructor Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    View your assigned courses and track student progress
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
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
            color="bg-blue-500"
          />
          <StatCard
            icon={Users}
            title="Total Students"
            value={instructorStats?.totalStudents || 0}
            color="bg-green-500"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
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
