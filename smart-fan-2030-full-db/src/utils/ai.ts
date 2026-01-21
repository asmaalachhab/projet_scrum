export type ChatRole = "user" | "assistant" | "system";
export type ChatMessage = { role: ChatRole; content: string };

export async function askAI(messages: ChatMessage[]) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`HTTP_${res.status} ${err}`);
  }

  const data = (await res.json()) as { reply?: string };
  return String(data.reply ?? "").trim();
}
