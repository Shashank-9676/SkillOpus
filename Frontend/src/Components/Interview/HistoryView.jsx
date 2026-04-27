import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, History, Trophy, Clock, XCircle, SearchX, Filter, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { SUBJECTS } from "./SetupView";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const STATUS_OPTIONS = ["All", "Completed", "Incomplete"];

const HistoryView = ({ onBack }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showSubjectDropdown) return;
    const close = () => setShowSubjectDropdown(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showSubjectDropdown]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/interview/history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load your interview history.");
    } finally {
      setIsLoading(false);
    }
  };

  // Derive filtered list
  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const statusMatch =
        statusFilter === "All" ||
        (statusFilter === "Completed" && s.status === "completed") ||
        (statusFilter === "Incomplete" && s.status !== "completed");
      const subjectMatch = subjectFilter === "All" || s.subject === subjectFilter;
      return statusMatch && subjectMatch;
    });
  }, [sessions, statusFilter, subjectFilter]);

  // Unique subjects present in user's history (for the dropdown)
  const availableSubjects = useMemo(() => {
    const set = new Set(sessions.map((s) => s.subject));
    return ["All", ...SUBJECTS.filter((s) => set.has(s))];
  }, [sessions]);

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto"
    >
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Setup
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <History className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Interviews</h2>
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        {!isLoading && sessions.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Filters</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Status pills */}
              <div className="flex gap-1.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      statusFilter === opt
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-sm"
                        : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-violet-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Subject dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSubjectDropdown((v) => !v);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    subjectFilter !== "All"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-sm"
                      : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-violet-400"
                  }`}
                >
                  {subjectFilter === "All" ? "All Subjects" : subjectFilter}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSubjectDropdown ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showSubjectDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-20 overflow-hidden"
                    >
                      {availableSubjects.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSubjectFilter(s);
                            setShowSubjectDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-all ${
                            subjectFilter === s
                              ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                              : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {s === "All" ? "All Subjects" : s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Active filter summary */}
            {(statusFilter !== "All" || subjectFilter !== "All") && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  Showing {filtered.length} of {sessions.length} interviews
                </span>
                <button
                  onClick={() => { setStatusFilter("All"); setSubjectFilter("All"); }}
                  className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Content Section ─────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-slate-400 mt-4 font-medium">Loading history...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8 text-gray-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No past interviews</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              It looks like you haven't completed any mock interviews yet.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8 text-gray-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No matching interviews</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              Try adjusting your filters to see more results.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((session, i) => (
              <motion.div
                key={session._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {session.subject}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                          session.difficulty === "Beginner"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : session.difficulty === "Intermediate"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                      >
                        {session.difficulty}
                      </span>
                      {session.status !== "completed" && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Incomplete
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {session.status === "completed" && session.score !== null && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-violet-50 dark:from-violet-900/10 to-indigo-50 dark:to-indigo-900/10 px-4 py-2 rounded-xl border border-violet-100 dark:border-violet-900/30">
                      <Trophy className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                      <div className="text-2xl font-black text-gray-900 dark:text-white">
                        {session.score}
                        <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">
                          /5
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {session.feedback && session.feedback.strengths && (
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-gray-600 dark:text-slate-300">
                    <p className="mb-2">
                      <strong className="text-emerald-600 dark:text-emerald-400">Strengths:</strong>{" "}
                      {session.feedback.strengths}
                    </p>
                    <p>
                      <strong className="text-rose-600 dark:text-rose-400">To Improve:</strong>{" "}
                      {session.feedback.improvements}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HistoryView;
