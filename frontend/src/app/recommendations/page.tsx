"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecommendations } from "@/lib/api";

function RecommendationsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cards, setCards] = useState<Array<{
    name: string;
    image_url: string;
    apply_link: string;
    reward_simulation?: string;
    reward_details?: string[];
    llm_reason?: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("Missing session ID. Please return to chat and try again.");
      setLoading(false);
      return;
    }
    getRecommendations(sessionId, 3)
      .then((data) => {
        if (data && data.recommendations && Array.isArray(data.recommendations)) {
          setCards(data.recommendations);
        } else {
          setError("No recommendations found. Please return to chat and try again.");
        }
      })
      .catch(() => {
        setError("Failed to fetch recommendations. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">Loading recommendations...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">{error}</h2>
        <button className="bg-blue-700 text-white px-4 py-2 rounded" onClick={() => router.push("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232526] to-[#414345] flex flex-col items-center py-14">
      <h1 className="text-5xl font-black mb-14 text-center text-[#FFD700] drop-shadow-lg tracking-wider">Top Credit Card Recommendations</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl">
        {cards.length === 0 ? (
          <div className="text-white text-center w-full col-span-3">
            <p>No recommendations found. Please return to chat and try again.</p>
          </div>
        ) : (
          cards.map((card, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#232526] to-[#393e46] rounded-3xl shadow-2xl p-10 flex flex-col items-center border-2 border-[#FFD700] hover:scale-105 transition-transform duration-200">
              {card.image_url ? (
                <img src={card.image_url} alt={card.name} className="w-48 h-32 object-contain mb-8 rounded-xl shadow-md bg-[#232526] border border-[#FFD700]" />
              ) : (
                <div className="w-48 h-32 flex items-center justify-center mb-8 rounded-xl shadow-md bg-[#232526] border border-[#FFD700] text-[#FFD700] text-lg">No Image</div>
              )}
              <h2 className="text-2xl font-extrabold mb-4 text-center text-[#FFD700] drop-shadow-lg">{card.name}</h2>
              {card.llm_reason && (
                <p className="text-base text-[#43cea2] mb-2 text-center font-semibold">{card.llm_reason}</p>
              )}
              {/*
              {card.reward_simulation && (
                <div className="mb-2 text-center">
                  <span className="text-sm text-[#FFD700] font-bold">Reward Simulation:</span>
                  <span className="text-sm text-white ml-2">{card.reward_simulation}</span>
                </div>
              )}
              {card.reward_details && card.reward_details.length > 0 && (
                <div className="mb-2 text-left w-full">
                  <span className="text-sm text-[#FFD700] font-bold">Reward Details:</span>
                  <ul className="list-disc list-inside text-white text-sm mt-1">
                    {card.reward_details.map((detail: string, i: number) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
              */}
              <a
                href={card.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#43cea2]/80 hover:to-[#185a9d]/80 text-white px-8 py-4 rounded-xl shadow font-bold text-lg transition tracking-wide"
              >
                Apply Now
              </a>
            </div>
          ))
        )}
      </div>
      <button className="mt-16 bg-[#185a9d] hover:bg-[#43cea2] text-white px-10 py-4 rounded-xl font-extrabold text-lg shadow-lg tracking-wide" onClick={() => router.push("/")}>Back to Chat</button>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div>Loading recommendations...</div>}>
      <RecommendationsPageInner />
    </Suspense>
  );
}
