
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

if (!API_BASE && typeof window !== 'undefined') {
  console.warn("NEXT_PUBLIC_API_BASE is not defined. API calls will likely fail.");
}

// Ensure WebSocket uses secure protocol (wss) if API is HTTPS
export const WS_BASE = API_BASE.startsWith("https") 
  ? API_BASE.replace("https", "wss") 
  : API_BASE.replace("http", "ws");
