from flask import Flask, request, jsonify, Response
from dotenv import load_dotenv
import os
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from flask_cors import CORS
import requests
import json
import base64
import tempfile
import assemblyai as aai

load_dotenv()

app = Flask(__name__)

# ── CORS: explicit origins + cover ALL responses including errors ──────────────
CORS(app, resources={r"/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

@app.after_request
def inject_cors(response):
    """Ensure CORS headers are present on every response, including 4xx/5xx."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

# ── API Keys ──────────────────────────────────────────────────────────────────
gemini_key = os.getenv("GEMINI_API_KEY")
aai_key    = os.getenv("ASSEMBLYAI_API_KEY")
murf_key   = os.getenv("MURF_API_KEY")

if aai_key:
    aai.settings.api_key = aai_key

# ── LangGraph: one shared checkpointer, sessions isolated by thread_id ─────────
checkpointer = InMemorySaver()
model        = init_chat_model("google_genai:gemini-2.5-flash", api_key=gemini_key)
agent        = create_agent(model=model, tools=[], checkpointer=checkpointer)

# ── Prompts ───────────────────────────────────────────────────────────────────
INTERVIEW_SYSTEM_PROMPT = """You are Natalie, a friendly and conversational AI interviewer.

IMPORTANT GUIDELINES:
1. Ask SHORT and CRISP questions (1-2 sentences maximum).
2. ALWAYS reference what the candidate ACTUALLY said in their previous answer.
3. Do NOT make up or assume their responses.
4. Adapt difficulty based on their ACTUAL performance.
5. Be warm and conversational but CONCISE.
6. Only acknowledge what the candidate truly said. Never hallucinate responses.
7. YOU control the interview flow. Once you feel you have adequately evaluated the candidate's skills (usually after 3 to 7 questions), you must conclude the interview by thanking them and appending exactly "[END_INTERVIEW]" to the very end of your response."""

FEEDBACK_PROMPT = """Based on our complete interview conversation, provide feedback as valid JSON ONLY.
No markdown, no extra text, just pure JSON:
{
    "subject": "<topic discussed>",
    "candidate_score": <integer 1-10>,
    "feedback": "<specific strengths with examples from their actual answers>",
    "areas_of_improvement": "<specific gaps and constructive suggestions based on what they said>"
}"""

# ── Helpers ───────────────────────────────────────────────────────────────────
def get_audio_base64(text):
    """Convert text to speech via Murf.ai, return base64-encoded MP3 or None."""
    if not murf_key:
        return None
    try:
        url     = "https://global.api.murf.ai/v1/speech/stream"
        headers = {"api-key": murf_key, "Content-Type": "application/json"}
        payload = {
            "voice_id":           "en-US-natalie",
            "text":               text,
            "multi_native_locale":"en-US",
            "model":              "FALCON",
            "format":             "MP3",
            "sampleRate":         24000,
            "channelType":        "MONO"
        }
        resp = requests.post(url, headers=headers, json=payload, stream=True, timeout=30)
        if resp.status_code == 200:
            audio_bytes = b"".join(c for c in resp.iter_content(chunk_size=4096) if c)
            return base64.b64encode(audio_bytes).decode("utf-8")
        print(f"[Murf Error] {resp.status_code}: {resp.text}")
        return None
    except Exception as exc:
        print(f"[Murf Exception] {exc}")
        return None


def transcribe_audio(audio_path):
    """Transcribe audio file with AssemblyAI; returns empty string on failure."""
    if not aai_key:
        return ""
    try:
        transcriber = aai.Transcriber()
        config      = aai.TranscriptionConfig(
            speech_model=aai.SpeechModel.universal,
            language_detection=True,
        )
        transcript = transcriber.transcribe(audio_path, config=config)
        return transcript.text if transcript.text else ""
    except Exception as exc:
        print(f"[Transcription Error] {exc}")
        return ""


def parse_feedback_json(content, subject):
    """Extract and parse the JSON block from the LLM feedback response."""
    try:
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        start = content.find("{")
        end   = content.rfind("}") + 1
        if start >= 0 and end > start:
            content = content[start:end]
        return json.loads(content)
    except Exception as exc:
        print(f"[JSON Parse Error] {exc}")
        return {
            "subject":              subject,
            "candidate_score":      3,
            "feedback":             "Interview completed. You demonstrated knowledge on the subject.",
            "areas_of_improvement": "Continue practising core concepts for stronger performance."
        }


def generate_agent_response(messages, config):
    """
    Invokes the agent, awaits the full text response,
    generates TTS audio, and returns both synchronously.
    """
    try:
        response = agent.invoke({"messages": messages}, config=config)
        content = response["messages"][-1].content
        
        audio_b64 = None
        if content.strip():
            audio_b64 = get_audio_base64(content.strip())
            
        return {"text": content, "audio_base64": audio_b64}
    except Exception as exc:
        print(f"[LLM ERROR] {exc}")
        err_str = str(exc).lower()
        if "429" in err_str or "resourceexhausted" in err_str or "quota" in err_str:
            raise Exception("RATE_LIMIT")
        raise exc


# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "SkillOpus AI Interview"})


@app.route("/start-interview", methods=["POST", "OPTIONS"])
def start_interview():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data       = request.json or {}
        subject    = data.get("subject", "Python")
        difficulty = data.get("difficulty", "Intermediate")
        thread_id  = data.get("thread_id")

        if not thread_id:
            return jsonify({"error": "thread_id is required"}), 400

        config        = {"configurable": {"thread_id": thread_id}}
        system_prompt = (
            f"{INTERVIEW_SYSTEM_PROMPT}\n\n"
            f"Topic: {subject} | Difficulty: {difficulty}"
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": (
                f"Start the interview with a brief warm greeting and ask your first "
                f"{subject} question appropriate for {difficulty} level. "
                f"Keep it SHORT (2-4 sentences total)."
            )}
        ]

        result = generate_agent_response(messages, config)
        return jsonify(result)

    except Exception as exc:
        print(f"[start_interview ERROR] {exc}")
        err_str = str(exc).lower()
        if "429" in err_str or "resourceexhausted" in err_str or "quota" in err_str:
            return jsonify({"error": "RATE_LIMIT", "details": str(exc)}), 429
        return jsonify({"error": str(exc)}), 500


@app.route("/submit-answer", methods=["POST", "OPTIONS"])
def submit_answer():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        is_multipart = request.content_type and "multipart/form-data" in request.content_type

        if is_multipart:
            thread_id      = request.form.get("thread_id", "")
            question_count = int(request.form.get("question_count", 1))
            is_last        = request.form.get("is_last", "false").lower() == "true"
            frontend_text  = request.form.get("answerText", "").strip()
            answer         = frontend_text

            if not answer and "audio" in request.files:
                audio_file = request.files["audio"]
                with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
                    audio_file.save(tmp.name)
                    temp_path = tmp.name
                answer = transcribe_audio(temp_path)
                try:
                    os.unlink(temp_path)
                except Exception:
                    pass
        else:
            data           = request.json or {}
            thread_id      = data.get("thread_id", "")
            question_count = int(data.get("question_count", 1))
            is_last        = data.get("is_last", False)
            answer         = data.get("answer", "")

        if not thread_id:
            return jsonify({"error": "thread_id is required"}), 400

        if not answer or not answer.strip():
            answer = "I'm not sure about this — could we move on?"

        print(f"[A{question_count}] {answer}")

        config = {"configurable": {"thread_id": thread_id}}

        # Persist user answer in LangGraph memory
        agent.invoke({"messages": [{"role": "user", "content": answer}]}, config=config)

        next_q = question_count + 1
        prompt = (
            f"The candidate just answered question {question_count}.\n\n"
            f"Look at their ACTUAL answer in the conversation above. "
            f"Do NOT assume what they said.\n\n"
            f"Now, evaluate if you have enough information to end the interview. "
            f"If YES, conclude it gracefully and append [END_INTERVIEW]. "
            f"If NO, ask question {next_q}:\n"
            f"1. Briefly acknowledge what they ACTUALLY said (1 sentence max)\n"
            f"2. Ask your next question building on their REAL response (1-2 sentences)\n"
            f"3. Adjust difficulty based on their confidence\n"
            f"4. Keep TOTAL response under 3-4 sentences\n\n"
            f"Be conversational and CONCISE. Only reference what they truly said."
        )

        result = generate_agent_response([{"role": "user", "content": prompt}], config)
        text_content = result["text"]
        
        # Check if AI concluded the interview
        is_completed = False
        if "[END_INTERVIEW]" in text_content:
            is_completed = True
            text_content = text_content.replace("[END_INTERVIEW]", "").strip()
            
        return jsonify({
            "status": "completed_pending_audio" if is_completed else "active",
            "text": text_content,
            "audio_base64": result["audio_base64"],
            "transcribed_answer": answer,
            "question_number": next_q
        })

    except Exception as exc:
        print(f"[submit_answer ERROR] {exc}")
        err_str = str(exc).lower()
        if "429" in err_str or "resourceexhausted" in err_str or "quota" in err_str:
            return jsonify({"error": "RATE_LIMIT", "details": str(exc)}), 429
        return jsonify({"error": str(exc)}), 500


@app.route("/get-feedback", methods=["POST", "OPTIONS"])
def get_feedback():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data      = request.json or {}
        thread_id = data.get("thread_id")
        subject   = data.get("subject", "general")

        if not thread_id:
            return jsonify({"error": "thread_id is required"}), 400

        config   = {"configurable": {"thread_id": thread_id}}
        response = agent.invoke({
            "messages": [{
                "role":    "user",
                "content": f"{FEEDBACK_PROMPT}\n\nEvaluate the complete {subject} interview we just conducted."
            }]
        }, config=config)

        content = response["messages"][-1].content
        print(f"[Feedback Raw]\n{content}\n")

        return jsonify(parse_feedback_json(content, subject))

    except Exception as exc:
        print(f"[get_feedback ERROR] {exc}")
        err_str = str(exc).lower()
        if "429" in err_str or "resourceexhausted" in err_str or "quota" in err_str:
            return jsonify({"error": "RATE_LIMIT", "details": str(exc)}), 429
        return jsonify({"error": str(exc)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)