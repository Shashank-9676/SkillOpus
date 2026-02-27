import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {BookOpen,Plus,FileText,Users,CheckCircle,ArrowLeft,GraduationCap,BarChart3,Layers,} from "lucide-react";
import Cookies from "js-cookie";
import SyncLoader from "react-spinners/SyncLoader";
import { Link, useParams, useNavigate } from "react-router";
import LessonCard from "./LessonCard";
import AddLessonForm from "./AddLessonForm";
import Header from "./Header";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const api = import.meta.env.VITE_API_URL;

const LEVEL_COLORS = {
  beginner:
    "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  intermediate:
    "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
  advanced: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300",
};

const CourseDetail = () => {
  const { userDetails } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState({});
  const [lessons, setLessons] = useState([]);

  const authHeader = { Authorization: `Bearer ${Cookies.get("jwt_token")}` };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [courseRes, lessonsRes, statsRes] = await Promise.all([
        fetch(`${api}/courses/${id}`, { headers: authHeader }),
        fetch(`${api}/courses/${id}/lessons`, { headers: authHeader }),
        fetch(`${api}/stats/course/${id}`, { headers: authHeader }),
      ]);
      if (courseRes.ok) setCourseData((await courseRes.json()).details);
      if (lessonsRes.ok) setLessons((await lessonsRes.json()).details);
      if (statsRes.ok) setStats((await statsRes.json()).details);

      if (userDetails?.role === "student") {
        const progRes = await fetch(
          `${api}/progress/course/${id}/user/${userDetails.id}`,
          { headers: authHeader },
        );
        if (progRes.ok)
          setProgress((await progRes.json()).details?.percent ?? 0);
      }
    } catch (err) {
      toast.error("Failed to load course data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Header />
        <SyncLoader color="#6366f1" size={14} margin={5} />
        <p className="text-sm text-gray-400 dark:text-slate-500">Loading course…</p>
      </div>
    );
  }

  const levelKey = courseData.level?.toLowerCase();
  const levelBadge = LEVEL_COLORS[levelKey] || LEVEL_COLORS.beginner;
  const isStudent = userDetails?.role === "student";
  const isInstructor = userDetails?.role === "instructor";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      {/* ── Hero / Course Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-indigo-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 min-w-0"
            >
              {/* Category + level badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {courseData.category && (
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200 dark:text-indigo-400">
                    {courseData.category}
                  </span>
                )}
                {courseData.level && (
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${levelBadge}`}
                  >
                    {courseData.level}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2 truncate">
                {courseData.title}
              </h1>
              <p className="text-indigo-100 dark:text-slate-400 text-sm max-w-2xl line-clamp-2">
                {courseData.description}
              </p>
            </motion.div>

            {/* Add Lesson button (non-students) */}
            {!isStudent && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowAddLessonForm(true)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-xl backdrop-blur-sm shadow-lg transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Lesson
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Quick-stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {/* Level */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                Level
              </p>
              <p className="font-bold text-gray-900 dark:text-white capitalize">
                {courseData.level || "—"}
              </p>
            </div>
          </div>

          {/* Total Lessons */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                Lessons
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                {stats?.totalLessons ?? lessons.length}
              </p>
            </div>
          </div>

          {/* Students (non-student) or Progress (student) */}
          {!isStudent ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                  Enrolled
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {stats?.enrolledStudents ?? "—"}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                    Your Progress
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {progress}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Students Progress link (instructor) or BookOpen (admin) */}
          {isInstructor && stats?.enrolledStudents > 0 ? (
            <Link to={`/progress/${id}`} className="block">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 flex items-center gap-3 h-full cursor-pointer hover:opacity-90 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-indigo-100 font-medium">
                    Student Progress
                  </p>
                  <p className="font-bold text-white">View Report →</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                  Category
                </p>
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {courseData.category || "—"}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Lessons Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Course Lessons
              </h2>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">
                {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} in this
                course
              </p>
            </div>
            {!isStudent && (
              <button
                onClick={() => setShowAddLessonForm(true)}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Lesson
              </button>
            )}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {lessons.length > 0 ? (
                <motion.div
                  key="lessons"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {lessons.map((lesson) => (
                    <motion.div
                      key={lesson._id}
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <LessonCard lesson={lesson} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No lessons yet</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                    {isStudent ? "Lessons will appear here once your instructor adds them.": "Start building your course by adding the first lesson."}
                  </p>
                  {!isStudent && (
                    <button onClick={() => setShowAddLessonForm(true)} className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
                      <Plus className="w-4 h-4" /> Add First Lesson
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Add Lesson Modal */}
      {showAddLessonForm && (
        <AddLessonForm setShowAddLessonForm={setShowAddLessonForm} id={id} />
      )}
    </div>
  );
};

export default CourseDetail;
