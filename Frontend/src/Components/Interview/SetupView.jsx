import { motion } from "framer-motion";
import { Brain, ChevronRight, MessageSquare, Volume2, Award, Loader2 } from "lucide-react";

export const SUBJECTS = [
  "Python", "JavaScript", "React", "Node.js", "DSA", 
  "System Design", "SQL", "Machine Learning", "Java", "C++"
];
export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const SetupView = ({ subject, setSubject, difficulty, setDifficulty, isLoading, handleStart, onViewHistory }) => {
  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="flex-1 flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-lg">
        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Mock Interview
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg">
            Practice with <span className="font-semibold text-violet-600">Natalie</span>, your AI interviewer
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-8">
          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
              Choose Subject
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    subject === s
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md"
                      : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-violet-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all border ${
                    difficulty === d
                      ? d === "Beginner"
                        ? "bg-emerald-500 text-white border-transparent shadow"
                        : d === "Intermediate"
                        ? "bg-amber-500 text-white border-transparent shadow"
                        : "bg-rose-500 text-white border-transparent shadow"
                      : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-violet-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: MessageSquare, label: "5 Questions", color: "text-blue-500" },
              { icon: Volume2, label: "Voice I/O", color: "text-violet-500" },
              { icon: Award, label: "AI Feedback", color: "text-amber-500" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-slate-800"
              >
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-xs font-medium text-gray-600 dark:text-slate-400">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 mb-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Starting…
              </>
            ) : (
              <>
                <ChevronRight className="w-5 h-5" /> Start Interview
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewHistory}
            className="w-full py-3 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 rounded-2xl transition-all shadow-sm"
          >
            View Past Interviews
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SetupView;
