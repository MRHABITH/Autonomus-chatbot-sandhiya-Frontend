export interface ChatResponse {
    reply: string;
    sources: Source[];
    escalated: boolean;
    ticket_id?: string;
}

export interface Source {
    title: string;
    url: string;
    snippet: string;
    score: number;
}

// Use environment variable for production, fallback to your deployed Vercel backend URL
const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://autonomus-chatbot-sandhiya-backend.vercel.app").replace(/\/$/, "");

export async function sendMessage(message: string, sessionId: string, userId: string = 'user-1'): Promise<ChatResponse> {
    console.log(`Attempting to fetch: ${API_BASE_URL}/chat`);
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            user_id: userId,
            message: message,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error (${response.status}): ${errorText || response.statusText}`);
    }

    return response.json();
}
