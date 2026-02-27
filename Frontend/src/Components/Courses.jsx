import { useEffect, useState, useMemo } from "react";
import { BookOpen, Plus, Search, X, SlidersHorizontal } from "lucide-react";
import Cookies from "js-cookie";
import Header from "./Header";
import CourseCard from "./CourseCard";
import CreateCourseForm from "./AddCourseForm";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import SyncLoader from "react-spinners/SyncLoader";
import { motion, AnimatePresence } from "framer-motion";

const api = import.meta.env.VITE_API_URL;

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const { userDetails } = useAuth();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
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
    } catch {
      toast.error("Network error — could not create course.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = useMemo(
    () =>
      courses.filter((c) => {
        const matchSearch =
          c.title?.toLowerCase().includes(search.toLowerCase()) ||
          c.category?.toLowerCase().includes(search.toLowerCase());
        const matchLevel =
          level === "All" || c.level?.toLowerCase() === level.toLowerCase();
        return matchSearch && matchLevel;
      }),
    [courses, search, level],
  );

  const isAdmin = userDetails?.role === "admin";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <SyncLoader color="#6366f1" size={14} margin={5} />
          <p className="text-sm text-gray-400 dark:text-slate-500">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 dark:bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/10 dark:bg-violet-600/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-100 dark:text-indigo-400 mb-3">
              Course Library
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Explore Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 to-white dark:from-indigo-400 dark:to-violet-400">
                Learning Path
              </span>
            </h1>
            <p className="text-indigo-100 dark:text-slate-400 text-base mb-8">
              Browse all courses available in your organisation and keep
              growing.
            </p>

            {/* Search bar inside hero */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="text"
                placeholder="Search courses or categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md text-sm transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Admin create button — top right */}
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsOpen(true)}
              className="absolute top-14 right-6 lg:right-8 flex items-center gap-2 bg-white/20 hover:bg-white/30 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Course
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level filter chips + count row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 dark:text-slate-400 shrink-0" />
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  level === l
                    ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 shrink-0">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""}
            {search && (
              <span className="text-indigo-500 dark:text-indigo-400">
                {" "}
                for &ldquo;{search}&rdquo;
              </span>
            )}
          </p>
        </div>

        {/* Grid / empty state */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-28 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10"
            >
              <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-9 h-9 text-indigo-500 dark:text-indigo-400" />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                No courses found
              </p>
              <p className="text-gray-500 dark:text-slate-400 text-sm">
                {search || level !== "All"
                  ? "Try clearing the filters."
                  : "No courses have been added yet."}
              </p>
              {(search || level !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setLevel("All");
                  }}
                  className="m-5 inline-flex items-center gap-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white text-sm font-semibold px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/15 transition-all"
                >
                  <X className="w-4 h-4" /> Clear filters
                </button>
              )}
              {isAdmin && !search && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" /> Create Course
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
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
        </AnimatePresence>
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
