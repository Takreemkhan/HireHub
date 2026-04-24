"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ChatRequest {
  _id: string;
  chatId: string;
  fromUserId: string;
  toUserId: string;
}

export default function ChatRequestList({
  userId,
  role,
}: {
  userId: string;
  role: "client" | "freelancer";
}) {
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/chat-request?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setRequests(data.requests || []));
  }, [userId]);

  const acceptChat = async (chatId: string) => {
    await fetch("/api/chat-request/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId }),
    });

    router.push(
      `/chat?chatId=${chatId}&userId=${userId}&role=${role}`
    );
  };

  if (requests.length === 0) {
    return (
      <div className="p-4 text-center">
        No chat requests
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {requests.map((req) => (
        <div
          key={req._id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <span>
            Chat request from{" "}
            {role === "client" ? req.fromUserId : req.toUserId}
          </span>
          <button
            onClick={() => acceptChat(req.chatId)}
            className="bg-orange-500 text-white px-3 py-1 rounded"
          >
            Accept
          </button>
        </div>
      ))}
    </div>
  );
}
