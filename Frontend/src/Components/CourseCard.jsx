import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import {
  Trash2,
  Eye,
  Edit,
  User,
  BookOpen,
  Clock,
  BarChart,
} from "lucide-react";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const CourseCard = ({ course, onCourseUpdate }) => {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    instructor_id: course.instructor_id || "",
    status: course.status || "draft",
  });
  const [instructorOptions, setInstructorOptions] = useState([]);

  const fetchInstructors = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/instructors`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        },
      );
      const data = await response.json();
      setInstructorOptions(
        data.details.map((inst) => ({
          value: inst._id,
          label: `${inst.username} - ${inst.department}`,
        })),
      );
    } catch (err) {
      console.error("Error fetching instructors:", err);
    }
  };

  useEffect(() => {
    if (isEditing && userDetails?.role === "admin") {
      fetchInstructors();
    }
  }, [isEditing, userDetails]);

  const viewDetails = () => {
    if (!userDetails) {
      toast.error("Please login to view details");
      navigate("/login");
      return;
    }

    if (userDetails.role === "student" && course.status === "pending") {
      toast.warning("Enrollment is pending approval.");
      return;
    }

    navigate(`/course/${course._id}`);
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/${course._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        },
      );

      if (response.ok) {
        toast.success("Course deleted successfully!");
        if (onCourseUpdate) onCourseUpdate();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/${course._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        toast.success("Course updated successfully!");
        const updatedCourse = await response.json();
        setFormData({
          title: updatedCourse.details.title,
          description: updatedCourse.details.description,
          status: updatedCourse.details.status,
        });
        setIsEditing(false);
        if (onCourseUpdate) onCourseUpdate();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const enrollment = async () => {
    if (!userDetails) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/enrollments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
        body: JSON.stringify({
          course_id: course._id,
          user_id: userDetails.id,
        }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      toast.error(
        data.message || "You don't have access to enroll in this course",
      );
      return;
    }
    toast.success("Request Sent Successfully! Wait for the approval.");
    if (onCourseUpdate) onCourseUpdate();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const currentStatus = course.status || "draft";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 h-full rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col group"
    >
      {/* Course Image Header */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-500">
          {/* Placeholder pattern/image */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-gray-900 to-black"></div>
        </div>

        {/* Helper Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm uppercase tracking-wide ${getStatusBadge(currentStatus)}`}
          >
            {currentStatus}
          </span>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-blue-100 bg-blue-500/20 backdrop-blur-sm rounded-md border border-blue-400/30">
            {course.category || "General"}
          </span>
          <h3 className="text-white text-xl font-bold leading-tight line-clamp-2 drop-shadow-sm">
            {course.title}
          </h3>
        </div>
      </div>

      {/* Course Body */}
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed h-10">
          {course.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          {userDetails?.role !== "instructor" && course.instructor && (
            <div className="flex items-center text-gray-600 dark:text-slate-300">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              <span className="truncate">{course.instructor}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600 dark:text-slate-300 ml-auto">
            <BarChart className="w-4 h-4 mr-2 text-purple-500" />
            <span className="first-letter:uppercase">
              {course.level || "All Levels"}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-slate-700">
          {userDetails?.role === "admin" ? (
            <div className="flex space-x-2 justify-end">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                onClick={viewDetails}
                title="View Details"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                <Edit className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                onClick={handleDeleteCourse}
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          ) : userDetails?.role === "instructor" ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
              onClick={viewDetails}
            >
              <BookOpen className="w-4 h-4" />
              <span>Manage Course</span>
            </motion.button>
          ) : (
            <div className="w-full">
              {!course.course_id && !course.status ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={enrollment}
                >
                  Enroll Now
                </motion.button>
              ) : course.status === "pending" ? (
                <button
                  className="w-full bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2.5 rounded-xl font-medium cursor-not-allowed flex items-center justify-center space-x-2"
                  disabled
                >
                  <Clock className="w-4 h-4" />
                  <span>Approval Pending</span>
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-blue-600 border border-blue-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                  onClick={viewDetails}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Continue Learning</span>
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Course
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="w-5 h-5 rotate-45" />{" "}
                  {/* Using Trash2 as X icon/Close */}
                </button>
              </div>

              <form onSubmit={handleEditCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="4"
                    required
                  />
                </div>
                {userDetails?.role === "admin" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor
                    </label>
                    <CustomSelect
                      options={instructorOptions}
                      value={formData.instructor_id}
                      onChange={(value) =>
                        setFormData({ ...formData, instructor_id: value })
                      }
                      placeholder="Select Instructor"
                      label="Instructor"
                    />
                  </div>
                )}
                {(userDetails?.role === "admin" ||
                  userDetails?.role === "instructor") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseCard;
