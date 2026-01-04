// export async function sendMessage(user_input: string, history: string[]) {
//   const res = await fetch("http://localhost:8000/chat", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ user_input, history })
//   });
//   const data = await res.json();
//   return data.reply;
// }

// src/app/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"; // loaded from env for deployment

export async function sendMessage(sessionId: string, userInput: string) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, user_input: userInput }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json(); // { reply, history }
}

// Add this function to call FastAPI backend for recommendations
export async function getRecommendations(session_id: string, top_k: number = 3) {
  const url = `${BASE_URL}/recommend?session_id=${encodeURIComponent(session_id)}&top_k=${top_k}`;
  const res = await fetch(url, {
    method: "POST", // or "GET" if your backend allows
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}
