import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, title, value, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center transition-all duration-300"
    >
      <div className={`p-4 rounded-xl ${color} bg-opacity-10 mr-5 shrink-0`}>
        <Icon className={`w-8 h-8 ${color.replace("bg-", "text-")}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
