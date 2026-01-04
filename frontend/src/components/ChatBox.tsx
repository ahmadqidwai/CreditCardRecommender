"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { sendMessage } from "@/lib/api"; 
import { v4 as uuidv4 } from "uuid";
import Message from "./Message";
import { useRouter, useSearchParams } from "next/navigation";
import { FaRedo } from "react-icons/fa";

interface MessageType {
  sender: "user" | "bot";
  text: string;
}

export default function ChatBotWrapper() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatBot />
    </Suspense>
  );
}

function ChatBot() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // If redirected back from recommendations, show a message
  useEffect(() => {
    // Check for a query param like ?from=recommendations
    const from = searchParams.get("from");
    if (from === "recommendations") {
      // Optionally show a toast, alert, or set a state to show a message
      alert("Welcome back! You can continue chatting or start a new recommendation.");
    }
  }, [searchParams]);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  // Ensure the bot always starts the conversation
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hello! 👋 I can help you find the best credit card for your needs. To get started, may I know your age?",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus the input textarea when the bot stops typing
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  // Handle sending user message and bot reply
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const updatedMessages: MessageType[] = [...messages, { sender: "user", text: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);
    try {
      const reply = await sendMessage(sessionId, input);
      setMessages([...updatedMessages, { sender: "bot", text: reply.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  // Restart chat
  const handleRestart = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hello! 👋 I can help you find the best credit card for your needs. To get started, may I know your age?",
      },
    ]);
    setInput("");
    setSessionId(uuidv4());
  };

  // Function to check if the last bot message is the DONE message
  const isDoneMessage = () => {
    if (messages.length === 0) return false;
    const lastMsg = messages[messages.length - 1];
    return (
      lastMsg.sender === "bot" &&
      /done/i.test(lastMsg.text) &&
      /top credit cards/i.test(lastMsg.text)
    );
  };

  // Function to fetch recommendations and navigate
  const handleShowRecommendations = async () => {
    setLoading(true);
    try {
      // No need to fetch recommendations here, just navigate with session_id
      router.push(`/recommendations?session_id=${encodeURIComponent(sessionId)}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#232526] to-[#414345] flex flex-col items-center justify-center px-2 sm:px-0">
      <div className="w-full flex flex-col items-center justify-center pt-4 pb-2 gap-2">
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 bg-[#232526] border border-[#393e46] text-[#FFD700] px-4 py-2 rounded-lg shadow hover:bg-[#393e46] transition text-base font-bold mb-2"
          title="Restart Chat"
          aria-label="Restart chat"
        >
          <FaRedo className="animate-spin-slow" aria-hidden="true" /> Start Over
        </button>
        <h1
          className="text-2xl sm:text-4xl md:text-6xl font-black text-center text-[#FFD700] drop-shadow-2xl tracking-widest select-none flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-['Montserrat',_cursive] break-words w-full px-2 sm:px-0"
        >
          <img src="/file.svg" alt="App Logo" className="h-8 w-8 sm:h-12 sm:w-12 mr-2" aria-hidden="true" />
          <span tabIndex={0} aria-label="Credit Card Recommender">Credit Card Recommender</span>
        </h1>
      </div>
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 bg-gradient-to-br from-[#232526] to-[#414345] shadow-2xl rounded-3xl border border-[#232526] min-h-[70vh] flex flex-col relative" role="main" aria-label="Chat interface">
        <div className="mb-8 text-center">
          <p className="text-lg sm:text-xl font-semibold text-[#43cea2] tracking-wide">
            Let me help you find the perfect credit card, personalized just for you!
          </p>
        </div>
        <div className="h-[28rem] sm:h-[32rem] overflow-y-auto border border-[#393e46] bg-gradient-to-br from-[#232526]/90 to-[#393e46]/90 p-3 sm:p-6 rounded-2xl shadow-inner flex flex-col gap-3" id="chat-messages" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`animate-fade-in-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Message sender={msg.sender} text={msg.text} />
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 animate-fade-in-up" aria-live="polite" aria-label="Bot is typing">
              <span className="w-3 h-3 bg-[#43cea2] rounded-full animate-bounce mr-1" />
              <span className="text-[#43cea2] font-semibold">Bot is typing</span>
              <span className="typing-dots ml-1">
                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
          {isDoneMessage() && (
            <div className="flex justify-center mt-6 animate-fade-in-up">
              <button
                onClick={handleShowRecommendations}
                disabled={loading}
                className="bg-gradient-to-r from-[#43cea2] to-[#185a9d] text-white px-8 py-3 rounded-xl shadow-lg hover:from-[#43cea2]/80 hover:to-[#185a9d]/80 transition font-bold text-xl tracking-wide focus:outline-none focus:ring-2 focus:ring-[#43cea2] focus:ring-offset-2"
                aria-label="See your credit card recommendations"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="loader spinner-border animate-spin w-5 h-5 border-2 border-t-[#FFD700] border-[#43cea2] rounded-full" aria-hidden="true"></span>
                    Loading...
                  </span>
                ) : (
                  "See Your Credit Cards"
                )}
              </button>
            </div>
          )}
        </div>
        <form className="flex mt-8 sm:mt-16 gap-3 flex-col sm:flex-row" role="search" aria-label="Send a message to the assistant" onSubmit={e => { e.preventDefault(); handleSend(); }}>
          <textarea
            ref={inputRef}
            className="flex-1 border border-[#232526] bg-[#232526] text-[#FFD700] px-5 py-4 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-[#43cea2] text-lg placeholder-[#bdbdbd] disabled:opacity-60 resize-none min-h-[3.5rem] max-h-32"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            disabled={loading}
            aria-label="Type your message"
            aria-multiline="true"
            rows={2}
            tabIndex={0}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#185a9d] hover:bg-[#43cea2] text-white px-8 py-4 rounded-xl shadow font-extrabold text-lg transition tracking-wide disabled:opacity-60 flex items-center justify-center min-w-[90px]"
            aria-label="Send message"
          >
            {loading ? (
              <span className="loader spinner-border animate-spin w-5 h-5 border-2 border-t-[#FFD700] border-[#43cea2] rounded-full" aria-hidden="true"></span>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap');
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .typing-dots .dot {
          animation: blink 1.2s infinite both;
          opacity: 0.7;
          font-size: 1.5em;
        }
        .typing-dots .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.7; }
          40% { opacity: 1; }
        }
        .loader.spinner-border {
          border-right-color: transparent;
          border-bottom-color: transparent;
        }
        .animate-spin-slow {
          animation: spin 2.5s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .max-w-2xl { max-width: 98vw !important; }
          .rounded-3xl { border-radius: 1.25rem !important; }
          .h-\[32rem\] { height: 22rem !important; }
          .h-\[28rem\] { height: 16rem !important; }
          .p-8 { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
