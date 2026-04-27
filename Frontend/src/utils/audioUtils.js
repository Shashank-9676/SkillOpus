// ─── Audio helpers ────────────────────────────────────────────────────────────
export const playBase64Audio = (base64, onEnd) => {
  if (!base64) {
    onEnd?.();
    return null;
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "audio/mp3" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.onended = () => {
    URL.revokeObjectURL(url);
    onEnd?.();
  };
  audio.play().catch((err) => {
    console.error("Audio playback restricted:", err);
    onEnd?.();
  });
  return audio;
};
