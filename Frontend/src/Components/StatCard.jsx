import { motion } from "framer-motion";
const colorMap = {
  blue: {
    accent: "bg-blue-500",
    soft: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  green: {
    accent: "bg-green-500",
    soft: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
  },
  purple: {
    accent: "bg-purple-500",
    soft: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
  },
  orange: {
    accent: "bg-orange-500",
    soft: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  pink: {
    accent: "bg-pink-500",
    soft: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-100",
  },
  indigo: {
    accent: "bg-indigo-500",
    soft: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
  },
};

const resolveColor = (color) => {
  if (!color) return colorMap.blue;
  const legacyMatch = color.match(/bg-(\w+)-/);
  const key = legacyMatch ? legacyMatch[1] : color;
  return colorMap[key] || colorMap.blue;
};

const StatCard = ({ icon: Icon, title, value, color, trend }) => {
  const c = resolveColor(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className={`h-1 w-full ${c.accent}`} />

      <div className="p-6 flex justify-between">
        <div className="flex items-center  mb-4">
          <div
            className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${c.soft}`}
          >
            <Icon className={`w-5 h-5 ${c.text}`} strokeWidth={1.75} />
          </div>
          {trend && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${c.soft} ${c.text}`}
            >
              {trend}
            </span>
          )}
        </div>
          <div className="flex flex-col items-center">
          <p className="text-3xl font-semibold text-gray-800 leading-none mb-1">
          {value ?? 0}
        </p>

        {/* Label */}
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          {title}
        </p>
          </div>
        
      </div>
    </motion.div>
  );
};

export default StatCard;
