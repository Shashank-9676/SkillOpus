import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Home, AlertTriangle } from "lucide-react";
import { TOTAL_QUESTIONS } from "./ChatView";

export const EndConfirmModal = ({
  showEndConfirm,
  setShowEndConfirm,
  answersLogLength,
  handleEndEarly,
}) => {
  return (
    <AnimatePresence>
      {showEndConfirm && (
        <motion.div
          key="end-confirm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEndConfirm(false)}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 p-7"
          >
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <X className="w-7 h-7 text-rose-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
              End Interview?
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-6">
              {answersLogLength > 0
                ? `You've answered ${answersLogLength} of ${TOTAL_QUESTIONS} questions. You can still get partial feedback.`
                : "You haven't answered any questions yet. No feedback will be available."}
            </p>

            <div className="flex flex-col gap-3">
              {/* Get Feedback — only show if at least 1 answer */}
              {answersLogLength > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleEndEarly(true)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Get Partial Feedback
                </motion.button>
              )}

              {/* Exit without feedback */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleEndEarly(false)}
                className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-semibold text-sm border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all"
              >
                <Home className="w-4 h-4" />
                Exit Without Feedback
              </motion.button>

              {/* Cancel */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowEndConfirm(false)}
                className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              >
                Continue Interview
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const NavWarningModal = ({
  showNavWarning,
  setShowNavWarning,
  resetInterview,
  pendingNav,
  navigate,
}) => {
  return (
    <AnimatePresence>
      {showNavWarning && (
        <motion.div
          key="nav-blocker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNavWarning(false)}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 p-7"
          >
            {/* Warning icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
              Leave Interview?
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-6 leading-relaxed">
              Your interview is still in progress. If you leave now, your session will be lost and you won't receive feedback.
            </p>

            <div className="flex flex-col gap-3">
              {/* Stay — primary action */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowNavWarning(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-md"
              >
                Stay in Interview
              </motion.button>

              {/* Leave anyway */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowNavWarning(false);
                  resetInterview(); // disables all guards (sets view → "setup")
                  if (pendingNav) navigate(pendingNav);
                }}
                className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-semibold text-sm border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all"
              >
                Leave Anyway
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CheatWarningModal = ({
  showCheatWarning,
  setShowCheatWarning,
  tabSwitches,
}) => {
  return (
    <AnimatePresence>
      {showCheatWarning && (
        <motion.div
          key="cheat-blocker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          {/* Backdrop (Red tinted for urgency) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-900/80 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-500 p-8 text-center"
          >
            {/* Warning icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Focus Lost Detected!
            </h3>
            <p className="text-base text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
              You navigated away from the interview window. Switching tabs, opening new windows, exiting fullscreen, or using shortcuts like <strong>Ctrl+Tab</strong> is strictly prohibited during the assessment.
            </p>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-8">
               <p className="text-red-800 dark:text-red-300 font-bold text-lg">
                 Warning {tabSwitches} of 3
               </p>
               <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                 Your interview will be forcefully terminated if you reach 3 warnings.
               </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCheatWarning(false)}
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg transition-colors"
            >
              I Understand, Return to Interview
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
