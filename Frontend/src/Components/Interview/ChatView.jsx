import { motion } from "framer-motion";
import { X, Loader2, Volume2, MicOff, Mic, Send } from "lucide-react";
import ChatBubble from "../ChatBubble";

export const TOTAL_QUESTIONS = 5; // retained for legacy backwards compatibility if needed

const ChatView = ({
  questionCount,
  subject,
  difficulty,
  setShowEndConfirm,
  messages,
  isSaving,
  chatEndRef,
  isRecording,
  isPlaying,
  textInput,
  setTextInput,
  handleTextSubmit,
  inputDisabled,
  isLoading,
  stopRecording,
  startRecording,
}) => {
  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-6"
    >
      {/* Progress bar + End button */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">
              Question {questionCount}
            </span>
            <span className="text-xs text-violet-500 dark:text-violet-400 animate-pulse font-medium">
              Interview in Progress...
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {subject} · {difficulty}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEndConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all"
            >
              <X className="w-3 h-3" />
              End Interview
            </motion.button>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        {messages.map((msg, i) => (
          <ChatBubble key={msg.id} msg={msg} index={i} />
        ))}

        {/* Saving spinner */}
        {isSaving && (
          <div className="flex items-center gap-2 text-violet-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating feedback…</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {isRecording && (
        <p className="text-center text-xs text-rose-500 mt-2 font-medium animate-pulse">
          🔴 Recording — click the mic again to stop
        </p>
      )}

      {/* Input area */}
      <div className="mt-4">
        {isPlaying && (
          <div className="flex items-center gap-2 text-violet-500 text-xs mb-2 font-medium">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            Natalie is speaking…
          </div>
        )}
        <div className="flex items-end gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <textarea
            rows={1}
            value={textInput}
            onChange={(e) => {
              if (!isRecording) setTextInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleTextSubmit();
              }
            }}
            placeholder={
              isRecording
                ? "Listening… speak your answer"
                : inputDisabled
                ? "Wait for Natalie to finish…"
                : "Type your answer… (Enter to send)"
            }
            disabled={(inputDisabled && !isRecording) || isLoading}
            readOnly={isRecording}
            className={`flex-1 resize-none bg-transparent text-sm text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 outline-none min-h-[36px] max-h-[120px] ${
              inputDisabled && !isRecording ? "cursor-not-allowed opacity-60" : ""
            } ${isRecording ? "italic text-rose-500 dark:text-rose-400" : ""}`}
            style={{ height: "36px" }}
            onInput={(e) => {
              e.target.style.height = "36px";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Voice button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={inputDisabled || isLoading}
            title={isRecording ? "Stop recording" : "Record voice answer"}
            className={`p-2.5 rounded-xl transition-all disabled:opacity-40 ${
              isRecording
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900/30"
            } ${inputDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4 cursor-pointer" />
            ) : (
              <Mic
                className={`w-4 h-4 ${
                  inputDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                }`}
              />
            )}
          </motion.button>

          {/* Send button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || inputDisabled || isLoading || isRecording}
            className={`p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white transition-all hover:shadow-md ${
              !textInput.trim() || inputDisabled || isLoading || isRecording
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatView;
