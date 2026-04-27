import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import Header from "./Header";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// Utils & Sub-components
import { playBase64Audio } from "../utils/audioUtils";
import SetupView from "./Interview/SetupView";
import ChatView, { TOTAL_QUESTIONS } from "./Interview/ChatView";
import FeedbackView from "./Interview/FeedbackView";
import HistoryView from "./Interview/HistoryView";
import { EndConfirmModal, NavWarningModal, CheatWarningModal } from "./Interview/Modals";

const FLASK_URL = import.meta.env.VITE_FLASK_URL || "http://localhost:5000";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const InterviewPage = () => {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // View state
  const [view, setView] = useState("setup"); // setup | chat | feedback | history

  // Setup
  const [subject, setSubject] = useState("Python");
  const [difficulty, setDifficulty] = useState("Intermediate");

  // Session
  const [interviewId, setInterviewId] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);

  // Chat
  const [messages, setMessages] = useState([]);
  const [questionsLog, setQuestionsLog] = useState([]);
  const [answersLog, setAnswersLog] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);

  // Feedback
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showNavWarning, setShowNavWarning] = useState(false);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [tabSwitches, setTabSwitches] = useState(0);

  const [liveTranscript, setLiveTranscript] = useState("");

  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const currentAudioRef = useRef(null);
  const recognitionRef = useRef(null);
  const handleEndEarlyRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Navigation guard: warn on tab close / browser refresh ─────────────────
  useEffect(() => {
    if (view !== "chat") return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [view]);

  // ── Anti-Cheat: Tab switching / Focus loss / Fullscreen detection ─────────
  useEffect(() => {
    if (view !== "chat") return;

    let lastTrigger = 0;

    const handleViolation = () => {
      const now = Date.now();
      if (now - lastTrigger < 1500) return; // prevent spam
      lastTrigger = now;

      setTabSwitches((prev) => {
        const newCount = prev + 1;

        if (newCount >= 3) {
          toast.error("Interview terminated due to cheating.");
          // Use the ref to ensure we don't have stale state/closures
          if (handleEndEarlyRef.current) {
            handleEndEarlyRef.current(true);
          }
        } else {
          toast.warning("Do not switch tabs, windows, or exit fullscreen!");
          setShowCheatWarning(true);
        }

        return newCount;
      });
    };

    const handleVisibility = () => {
      if (document.hidden) handleViolation();
    };

    const handleBlur = () => {
      handleViolation();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        handleViolation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [view]);

    

  // ── Navigation guard: intercept in-app link clicks + back/forward button ──
  useEffect(() => {
    if (view !== "chat") return;

    const handleClick = (e) => {
      const anchor = e.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href === window.location.pathname ||
        href === "#"
      )
        return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setPendingNav(href);
      setShowNavWarning(true);
    };

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setPendingNav(null);
      setShowNavWarning(true);
    };

    window.history.pushState(null, "", window.location.href);

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [view]);
const enterFullscreen = () => {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};
  // ── Helpers ────────────────────────────────────────────────────────────────
  const addMessage = useCallback((role, text, isLoading = false) => {
    const id = Date.now() + Math.random();
    setMessages((prev) => [
      ...prev,
      { id, role, text, isLoading, isStreaming: false },
    ]);
    return id;
  }, []);

  const updateMessage = useCallback((id, text) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, text, isLoading: false, isStreaming: false } : m,
      ),
    );
  }, []);



  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("jwt_token")}`,
  });

  // ── Start Interview (streaming) ───────────────────────────────────────────
  const handleStart = async () => {
    setIsLoading(true);
    enterFullscreen();
    try {
      const sessionRes = await fetch(`${API_URL}/interview/start`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ subject, difficulty }),
      });
      if (!sessionRes.ok)
        throw new Error("Failed to create session on your server.");
      const { interviewId: id } = await sessionRes.json();
      setInterviewId(id);

      // Request Fullscreen for a proctored experience
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request failed:", err);
        });
      }

      // 2. Show loading bubble and switch to chat view
      const loadingId = addMessage("ai", "", true);
      setView("chat");

      // 3. Stream the first question from Flask
      const flaskRes = await fetch(`${FLASK_URL}/start-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, difficulty, thread_id: id }),
      });

      if (flaskRes.status === 429) {
        throw new Error("RATE_LIMIT");
      }
      if (!flaskRes.ok)
        throw new Error("Failed connecting to the AI Interview service.");

      const data = await flaskRes.json();
      const fullText = data.text;
      const audioBase64 = data.audio_base64;

      // Ensure final text is set cleanly and streaming cursor removed
      updateMessage(loadingId, fullText);
      setQuestionsLog([fullText]);
      setQuestionCount(1);

      if (audioBase64) {
        setIsPlaying(true);
        currentAudioRef.current = playBase64Audio(audioBase64, () => {
          setIsPlaying(false);
          setInputDisabled(false);
        });
      } else {
        setInputDisabled(false);
      }
    } catch (err) {
      console.error(err);
      if (
        err.message === "RATE_LIMIT" ||
        err.message?.includes("RATE_LIMIT") ||
        err.message?.includes("429")
      ) {
        toast.warning(
          "The AI is currently receiving too many requests. Please wait a moment and try again.",
        );
      } else {
        toast.error(
          err.message || "Failed to start the interview. Please try again.",
        );
      }
      setView("setup");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Submit Answer ─────────────────────────────────────────────────────────
  const submitAnswer = useCallback(
    async (answerText = null, audioBlob = null) => {
      setInputDisabled(true);
      setIsLoading(true);

      const displayText = answerText || (audioBlob ? "🎤 Voice answer…" : "");
      if (displayText) addMessage("user", displayText);

      try {
        let flaskRes;

        if (audioBlob) {
          const form = new FormData();
          form.append("audio", audioBlob, "answer.webm");
          form.append("thread_id", interviewId);
          form.append("question_count", String(questionCount));
          if (answerText) {
            form.append("answerText", answerText);
          }

          flaskRes = await fetch(`${FLASK_URL}/submit-answer`, {
            method: "POST",
            body: form,
          });
        } else {
          flaskRes = await fetch(`${FLASK_URL}/submit-answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              thread_id: interviewId,
              question_count: questionCount,
              answer: answerText,
            }),
          });
        }

        if (flaskRes.status === 429) throw new Error("RATE_LIMIT");
        if (!flaskRes.ok)
          throw new Error("Failed to process your answer. Network issue?");

        const data = await flaskRes.json();
        
        if (audioBlob && data.transcribed_answer) {
            setMessages((prev) => {
              const copy = [...prev];
              for (let i = copy.length - 1; i >= 0; i--) {
                if (
                  copy[i].role === "user" &&
                  copy[i].text === "🎤 Voice answer…"
                ) {
                  copy[i] = { ...copy[i], text: data.transcribed_answer };
                  break;
                }
              }
              return copy;
            });
        }

        // If AI concluded the interview dynamically
        if (data.status === "completed_pending_audio" || data.status === "completed") {
          const actualAnswer = data.transcribed_answer || answerText || "";
          setAnswersLog((prev) => [...prev, actualAnswer]);
          
          const loadingId = addMessage("ai", "", true);
          updateMessage(loadingId, data.text);
          setQuestionsLog((prev) => [...prev, data.text]);
          
          if (data.audio_base64) {
            setIsPlaying(true);
            currentAudioRef.current = playBase64Audio(data.audio_base64, () => {
              setIsPlaying(false);
              handleEndEarly(true); // Wait for the final goodbye audio to finish, then generate feedback
            });
          } else {
            handleEndEarly(true);
          }
          return;
        }

        // Normal path
        const loadingId = addMessage("ai", "", true);
        const actualAnswer = data.transcribed_answer || answerText || "";
        setAnswersLog((prev) => [...prev, actualAnswer]);

        // Replace the loader with the generated text
        updateMessage(loadingId, data.text);
        setQuestionsLog((prev) => [...prev, data.text]);
        setQuestionCount(data.question_number || questionCount + 1);
        
        if (data.audio_base64) {
          setIsPlaying(true);
          currentAudioRef.current = playBase64Audio(data.audio_base64, () => {
            setIsPlaying(false);
            setInputDisabled(false);
          });
        } else {
          setInputDisabled(false);
        }
      } catch (err) {
        console.error(err);
        if (
          err.message === "RATE_LIMIT" ||
          err.message?.includes("RATE_LIMIT") ||
          err.message?.includes("429")
        ) {
          toast.warning(
            "The AI is receiving too many requests. Please wait a few seconds and try answering again.",
          );
        } else {
          toast.error(
            "Something went wrong processing your answer. Please try again.",
          );
        }
        setInputDisabled(false);
      } finally {
        setIsLoading(false);
        setTextInput("");
      }
    },
    [questionCount, interviewId, addMessage, updateMessage],
  );

  // ── Get Feedback ──────────────────────────────────────────────────────────
  const handleFeedback = useCallback(async () => {
    setIsSaving(true);
    try {
      const flaskRes = await fetch(`${FLASK_URL}/get-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: interviewId, subject }),
      });

      if (flaskRes.status === 429) {
        toast.warning(
          "Feedback takes a bit longer due to high demand right now. Please test your connection or try ending again soon.",
        );
        setIsSaving(false);
        return;
      }

      if (!flaskRes.ok) throw new Error("Feedback generation failed.");
      const feedbackData = await flaskRes.json();
      setFeedback(feedbackData);

      const dbRes = await fetch(
        `${API_URL}/interview/${interviewId}/complete`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            questions: questionsLog,
            answers: answersLog,
            score: feedbackData.candidate_score,
            feedback: feedbackData,
          }),
        },
      );

      if (!dbRes.ok)
        toast.warn("Feedback generated but couldn't be saved to history.");

      setView("feedback");
      toast.success("Interview completed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(
        "Could not generate feedback. Please retry or contact support.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [interviewId, subject, questionsLog, answersLog, addMessage]);

  // ── Text submit ───────────────────────────────────────────────────────────
  const handleTextSubmit = () => {
    const trimmed = textInput.trim();
    if (!trimmed || inputDisabled || isLoading) return;
    submitAnswer(trimmed, null);
  };

  // ── Voice recording ───────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const spokenText = transcriptRef.current;
        transcriptRef.current = "";
        setLiveTranscript("");
        setTextInput("");
        submitAnswer(spokenText, blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          let interim = "";
          let final = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const t = event.results[i][0].transcript;
            if (event.results[i].isFinal) final += t;
            else interim += t;
          }
          setLiveTranscript((prev) => {
            const updated = prev + final;
            const fullTranscript = updated + interim;
            setTextInput(fullTranscript);
            transcriptRef.current = fullTranscript;
            return updated;
          });
        };

        recognition.onerror = (e) => {
          console.warn("[SpeechRecognition]", e.error);
          toast.warning(`Speech recognition issue: ${e.error}`);
        };
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Microphone permission denied or not available. Please allow access in your browser settings.",
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecording(false);
  };

  // ── End interview early ────────────────────────────────────────────────
  const handleEndEarly = (getFeedback) => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      setLiveTranscript("");
      setTextInput("");
    }
    
    currentAudioRef.current?.pause();
    setShowEndConfirm(false);

    // Exit fullscreen if active
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen failed:", err);
      });
    }

    if (getFeedback && answersLog.length > 0) {
      handleFeedback();
    } else {
      resetInterview();
      toast.info("Interview ended early without feedback.");
    }
  };

  // Sync the ref with the latest handleEndEarly function
  handleEndEarlyRef.current = handleEndEarly;

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetInterview = () => {
    currentAudioRef.current?.pause();
    setView("setup");
    setMessages([]);
    setQuestionsLog([]);
    setAnswersLog([]);
    setQuestionCount(1);
    setFeedback(null);
    setInterviewId(null);
    setInputDisabled(true);
    setTextInput("");
    setLiveTranscript("");
    setIsRecording(false);
    setIsLoading(false);
    setIsPlaying(false);
    setIsSaving(false);
    setShowEndConfirm(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <Header />
      <AnimatePresence mode="wait">
        {view === "setup" && (
          <SetupView
            subject={subject}
            setSubject={setSubject}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            isLoading={isLoading}
            handleStart={handleStart}
            onViewHistory={() => setView("history")}
          />
        )}

        {view === "chat" && (
          <ChatView
            questionCount={questionCount}
            subject={subject}
            difficulty={difficulty}
            setShowEndConfirm={setShowEndConfirm}
            messages={messages}
            isSaving={isSaving}
            chatEndRef={chatEndRef}
            isRecording={isRecording}
            isPlaying={isPlaying}
            textInput={textInput}
            setTextInput={setTextInput}
            handleTextSubmit={handleTextSubmit}
            inputDisabled={inputDisabled}
            isLoading={isLoading}
            stopRecording={stopRecording}
            startRecording={startRecording}
          />
        )}

        {view === "feedback" && feedback && (
          <FeedbackView
            feedback={feedback}
            difficulty={difficulty}
            resetInterview={resetInterview}
          />
        )}

        {view === "history" && <HistoryView onBack={() => setView("setup")} />}
      </AnimatePresence>

      <EndConfirmModal
        showEndConfirm={showEndConfirm}
        setShowEndConfirm={setShowEndConfirm}
        answersLogLength={answersLog.length}
        handleEndEarly={handleEndEarly}
      />

      <NavWarningModal
        showNavWarning={showNavWarning}
        setShowNavWarning={setShowNavWarning}
        resetInterview={resetInterview}
        pendingNav={pendingNav}
        navigate={navigate}
      />

      <CheatWarningModal
        showCheatWarning={showCheatWarning}
        setShowCheatWarning={setShowCheatWarning}
        tabSwitches={tabSwitches}
      />
    </div>
  );
};

export default InterviewPage;
