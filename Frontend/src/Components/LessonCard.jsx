import {Video,FileText,Edit,Trash2,CheckCircle,Calendar,PlayCircle,ChevronRight} from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import VideoLesson from "./VideoLesson";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import SyncLoader from "react-spinners/SyncLoader";

const LessonCard = ({ lesson }) => {
  const { userDetails } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completed, setCompleted] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: lesson.title,
    content_url: lesson.content_url,
  });

  const openVideo = () => {
    setSelectedLesson(lesson);
    setIsOpen(true);
  };

  const closeVideo = () => {
    setIsOpen(false);
    setSelectedLesson(null);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditLesson = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/lessons/${lesson._id}`,
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
        toast.success("Lesson updated successfully!");
        setIsEditing(false);
        window.location.reload();
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to update lesson");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteLesson = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/lessons/${lesson.lesson_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
        },
      );
      if (response.ok) {
        toast.success("Lesson deleted successfully!");
        window.location.reload();
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to delete lesson");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/progress/lesson/${lesson._id}/user/${userDetails?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) setCompleted(data.details?.status);
      else toast.error(data.message);
    } catch {
      console.error("Error fetching progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails) fetchProgress();
    else setLoading(false);
  }, [lesson._id, completed, userDetails]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 h-[160px] flex items-center justify-center">
        <SyncLoader color="#6366f1" size={8} />
      </div>
    );
  }

  const isVideo =
    lesson.type === "video" ||
    lesson.content_url?.includes("youtube") ||
    lesson.content_url?.endsWith(".mp4");

  const isStudent = userDetails?.role === "student";
  const isDone = completed === 1;

  return (
    <>
      {/* ── Card ── */}
      <div
        onClick={openVideo}
        className={`group relative cursor-pointer rounded-2xl border p-5 flex flex-col h-full transition-all duration-300 hover:shadow-lg
          ${
            isDone
              ? "bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50"
              : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-600"
          }`}
      >
        {/* Top row: icon + title + actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Icon */}
            <div
              className={`p-2.5 rounded-xl shrink-0 transition-colors duration-300 ${
                isDone
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white"
              }`}
            >
              {isVideo ? (
                <Video className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>

            {/* Order + title */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                  Lesson {lesson.lesson_order}
                </span>
                {isStudent && isDone && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                    <CheckCircle className="w-2.5 h-2.5" /> Done
                  </span>
                )}
              </div>
              <h3
                className={`text-base font-bold leading-snug line-clamp-2 transition-colors ${
                  isDone
                    ? "text-emerald-800 dark:text-emerald-200"
                    : "text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                }`}
              >
                {lesson.title}
              </h3>
            </div>
          </div>

          {/* Edit / Delete (non-students) */}
          {!isStudent && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteLesson}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed flex-grow">
          {lesson.description || "No description provided."}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-3.5 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(lesson.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <button
            onClick={openVideo}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-300 ${
              isDone
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500"
            }`}
          >
            {isStudent ? (isDone ? "Review" : "Start") : "Preview"}
            {isStudent && !isDone ? (
              <PlayCircle className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <VideoLesson
        lesson={selectedLesson}
        isOpen={isOpen}
        onClose={closeVideo}
        completed={completed}
        setCompleted={setCompleted}
      />

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-6 w-full max-w-lg">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Lesson
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Update the lesson details below.
              </p>
            </div>
            <form onSubmit={handleEditLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Lesson Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Content URL
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="content_url"
                    value={formData.content_url}
                    onChange={handleChange}
                    placeholder="https://…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LessonCard;
