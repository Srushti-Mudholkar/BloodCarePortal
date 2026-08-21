import React from "react";
import { useState } from "react";
import API from "../utils/axios";
import Layout from "../components/Layout";

const ChatBot = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const handleAsk = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setAnswer("");
        try {
            const { data } = await API.post("/chat/ask", { question });
            if (data.success) {
                setAnswer(data.answer);
                setHistory((prev) => [...prev, { q: question, a: data.answer }]);
            }
        } catch (e) {
            setAnswer("Something went wrong. Try again.");
        } finally {
            setLoading(false);
            setQuestion("");
        }
    };

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🤖 Blood Bank AI Assistant</h1>
                <p className="text-gray-500 text-sm mt-1">Ask anything about blood donation, compatibility, or eligibility</p>
            </div>

            {/* Chat history */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-h-96 overflow-y-auto">
                {history.length === 0 && !answer && (
                    <div className="text-center text-gray-400 py-10">
                        <p className="text-4xl mb-3">🩸</p>
                        <p className="text-sm">Ask me about blood compatibility, donation rules, or eligibility</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {["Can O+ donate to A+?", "How often can I donate?", "What is universal donor?"].map((q) => (
                                <button key={q} onClick={() => setQuestion(q)}
                                    className="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-full border border-red-100 hover:bg-red-100 transition-colors">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {history.map((item, i) => (
                    <div key={i} className="mb-4">
                        <div className="flex justify-end mb-2">
                            <span className="bg-red-600 text-white px-4 py-2 rounded-2xl rounded-br-sm text-sm max-w-xs">
                                {item.q}
                            </span>
                        </div>
                        <div className="flex justify-start">
                            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm text-sm max-w-md leading-relaxed">
                                {item.a}
                            </span>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl text-sm">
                            <span className="animate-pulse">Thinking...</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex gap-3">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                    placeholder="Ask about blood donation..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                />
                <button onClick={handleAsk} disabled={loading}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-2xl transition-colors text-sm">
                    {loading ? "..." : "Ask"}
                </button>
            </div>
        </Layout>
    );
};

export default ChatBot;