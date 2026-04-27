/**
 * Reads an SSE (Server-Sent Events) stream from a fetch Response.
 * Calls onToken for each text chunk, and returns the full accumulated text.
 *
 * @param {Response} response - The fetch Response object (must be streaming SSE)
 * @param {Function} onToken  - Callback receiving each token string as it arrives
 * @returns {Promise<{fullText: string, meta: object|null}>}
 */
export async function readSSEStream(response, onToken) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";
  let meta = null;
  let audioBase64 = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE lines are separated by \n\n
    const parts = buffer.split("\n\n");
    // Last part may be incomplete — keep it in buffer
    buffer = parts.pop() || "";

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data: ")) continue;

      try {
        const payload = JSON.parse(line.slice(6)); // strip "data: "

        if (payload.type === "token" && payload.content) {
          fullText += payload.content;
          onToken(payload.content);
        } else if (payload.type === "meta") {
          meta = payload;
        } else if (payload.type === "audio") {
          audioBase64 = payload.base64;
        } else if (payload.type === "done") {
          // Use the server's full_text if available (authoritative)
          if (payload.full_text) fullText = payload.full_text;
        } else if (payload.type === "error") {
          throw new Error(payload.error || "Stream error");
        }
      } catch (e) {
        if (e.message === "Stream error" || e.message?.includes("Stream error")) throw e;
        // JSON parse error on a chunk — skip
        console.warn("[SSE parse skip]", e);
      }
    }
  }

  return { fullText, meta, audioBase64 };
}
