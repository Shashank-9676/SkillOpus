import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ScoreStars = ({ score }) => (
  <div className="flex gap-1 justify-center flex-wrap">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1 + i * 0.05, type: "spring" }}
      >
        <Star
          className={`w-6 h-6 sm:w-8 sm:h-8 ${i <= score ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-slate-600"}`}
        />
      </motion.div>
    ))}
  </div>
);

export default ScoreStars;