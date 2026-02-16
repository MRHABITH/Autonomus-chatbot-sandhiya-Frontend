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
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://autonomus-chatbot-sandhiya-backend.vercel.app";

export async function sendMessage(message: string, sessionId: string, userId: string = 'user-1'): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            user_id: userId,
            message: message,
        }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}
