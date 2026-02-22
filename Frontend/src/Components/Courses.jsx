import { useEffect, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import Cookies from "js-cookie";
import Header from "./Header";
import CourseCard from "./CourseCard";
import CreateCourseForm from "./AddCourseForm";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import SyncLoader from "react-spinners/SyncLoader";
import { motion } from "framer-motion";

const api = import.meta.env.VITE_API_URL;

const Courses = () => {
  const { userDetails } = useAuth();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api}/courses`, {
        headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
      });
      const data = await res.json();
      setCourses(data.details || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (courseData) => {
    try {
      const res = await fetch(`${api}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
        body: JSON.stringify(courseData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Course created successfully!");
        fetchCourses();
      } else {
        toast.error(data.message || "Failed to create course.");
      }
    } catch (err) {
      toast.error("Network error — could not create course.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SyncLoader color="#3B82F6" size={15} margin={5} />
      </div>
    );
  }

  const isAdmin = userDetails?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-1">
                Library
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                All Courses
              </h1>
              <p className="text-blue-100 mt-2 text-base">
                Browse and manage courses in your organisation.
              </p>
            </motion.div>

            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-all self-start"
              >
                <Plus className="w-5 h-5" />
                Create Course
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition"
          />
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-6">
          {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
          {search && ` for "${search}"`}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-400">
              No courses found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {search
                ? "Try a different search term."
                : "No courses available yet."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setIsOpen(true)}
                className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" /> Create First Course
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((course) => (
              <motion.div
                key={course._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <CourseCard course={course} onCourseUpdate={fetchCourses} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <CreateCourseForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Courses;
