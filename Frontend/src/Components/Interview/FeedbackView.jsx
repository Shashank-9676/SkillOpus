import { motion } from "framer-motion";
import { Award, CheckCircle, TrendingUp, RotateCcw, Home } from "lucide-react";
import ScoreStars from "../ScoreStars";

const FeedbackView = ({ feedback, difficulty, resetInterview }) => {
  return (
    <motion.div
      key="feedback"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex items-start justify-center px-4 py-10 overflow-y-auto"
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl mb-5"
          >
            <Award className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Interview Complete!
          </h2>
          <p className="text-gray-500 dark:text-slate-400">
            {feedback.subject} · {difficulty}
          </p>
        </div>

        {/* Score */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800 mb-5 text-center">
          <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-3">
            Performance Score
          </p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-7xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            {feedback.candidate_score}
            <span className="text-3xl text-gray-300">/5</span>
          </motion.div>
          <ScoreStars score={feedback.candidate_score} />
        </div>

        {/* Strengths */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Strengths</h3>
          </div>
          <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
            {feedback.feedback}
          </p>
        </div>

        {/* Areas of Improvement */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-800 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">
              Areas for Improvement
            </h3>
          </div>
          <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
            {feedback.areas_of_improvement}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetInterview}
            className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/")}
            className="flex-1 py-3.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-2xl font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Dashboard
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackView;
