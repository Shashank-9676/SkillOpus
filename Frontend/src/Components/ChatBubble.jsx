import { motion } from "framer-motion";
import { Brain, Loader2 } from "lucide-react";

const ChatBubble = ({ msg, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
  >
    {msg.role === "ai" && (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
        <Brain className="w-4 h-4 text-white" />
      </div>
    )}
    <div
      className={`max-w-[78%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
        msg.role === "ai"
          ? "bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-bl-none border border-gray-100 dark:border-slate-700"
          : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-none"
      }`}
    >
      {msg.role === "ai" && msg.isLoading && !msg.text ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Natalie is thinking…</span>
        </div>
      ) : (
        <span>
          {msg.text}
          {msg.role === "ai" && msg.isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-violet-500 dark:bg-violet-400 ml-0.5 rounded-sm animate-pulse align-middle" />
          )}
        </span>
      )}
    </div>
    {msg.role === "user" && (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
        <span className="text-white text-xs font-bold">You</span>
      </div>
    )}
  </motion.div>
);

export default ChatBubble;
