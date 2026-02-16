import { useState, useRef, useEffect } from "react";
import { sendMessage, type ChatResponse } from "../lib/api";
import "./ChatWidget.css";

export default function ChatWidget() {
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; sources?: any[] }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
        setInput("");
        setIsLoading(true);

        try {
            const response: ChatResponse = await sendMessage(userMessage, sessionId);

            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: response.reply || "No response generated.",
                    sources: response.sources
                }
            ]);
        } catch (error: any) {
            console.error("Failed to send message:", error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: error.message || "Sorry, I'm having trouble connecting to the server."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-widget">
            <div className="chat-header">
                <div className="header-info">
                    <div className="bot-avatar"></div>
                    <div className="header-text">
                        <h3>Autonomous AI</h3>
                        <p>Help Desk Online</p>
                    </div>
                </div>
                <div className="status-badge">
                    <span className="status-dot"></span>
                    Online
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <div className="welcome-icon">👋</div>
                        <h3>Welcome!</h3>
                        <p>I'm your AI assistant. How can I help you today?</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`message-group ${msg.sender}`}>
                        <div className={`message ${msg.sender}`}>
                            <div className="message-content">{msg.text}</div>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="message-sources">
                                    <strong>Sources:</strong>
                                    <ul>
                                        {msg.sources.map((src, i) => (
                                            <li key={i}>
                                                <a href={src.url} target="_blank" rel="noopener noreferrer">
                                                    {src.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message-group bot">
                        <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                />
                <button
                    className="send-button"
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                >
                    <svg
                        className="send-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
            <footer className="chat-footer">
                @2026 created by Sandhiya and his team. All rights reserved.
            </footer>
        </div>
    );
}
