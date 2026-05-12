"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContent";
import { useSocket } from "../../../context/socketContent";
import ChatWindow, { type ChatMessage } from "../../../components/chatWindow";
import MassegeInput from "../../../components/massegeInput";
import ActiveUser from "../../../components/activeUser";

type RoomMember = {
  id: string;
  name: string;
  email?: string;
};

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ room: string }>();
  const { user, isReady } = useAuth();
  const { socket, isConnected } = useSocket();
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const room = useMemo(() => params?.room ?? "", [params]);

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  useEffect(() => {
    if (!socket || !room || !user) {
      return;
    }

    socket.emit("room:join", { room, user });

    const handleMembers = (payload: {
      room: string;
      count: number;
      members?: RoomMember[];
    }) => {
      if (payload.room === room) {
        setMemberCount(payload.count);
        if (payload.members) {
          setMembers(payload.members);
        }
      }
    };

    const handleNewMessage = (payload: ChatMessage) => {
      if (payload.room === room) {
        setMessages((prev) => [...prev, payload]);
      }
    };

    const handleSystemMessage = (payload: Omit<ChatMessage, "id">) => {
      if (payload.room === room) {
        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            text: payload.text,
            ts: payload.ts,
            system: true,
          },
        ]);
      }
    };

    socket.on("room:members", handleMembers);
    socket.on("message:new", handleNewMessage);
    socket.on("message:system", handleSystemMessage);

    return () => {
      socket.emit("room:leave", { room, user });
      socket.off("room:members", handleMembers);
      socket.off("message:new", handleNewMessage);
      socket.off("message:system", handleSystemMessage);
    };
  }, [socket, room, user]);

  if (!isReady || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12">
        <Link
          href="/chat"
          className="text-sm text-slate-400 transition hover:text-amber-200"
        >
          Back to rooms
        </Link>
        <div className="mt-8 flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">#{room}</h1>
                <p className="mt-1 text-sm text-slate-400">
                  {isConnected ? "Connected" : "Connecting..."}
                </p>
              </div>
              <div className="rounded-full border border-slate-700 px-4 py-2 text-sm text-amber-200">
                Members online: {memberCount}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6">
              <ChatWindow messages={messages} currentUserName={user.name} />

              <MassegeInput
                onSend={(value) =>
                  socket?.emit("message:send", { room, text: value, user })
                }
                disabled={!isConnected}
              />
            </div>
            <aside className="w-full shrink-0 lg:w-72">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">
                    Live members
                  </h2>
                  <span className="text-xs text-slate-400">{memberCount}</span>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  {members.length === 0 ? (
                    <p className="text-xs text-slate-500">No members yet.</p>
                  ) : (
                    members.map((member) => (
                      <ActiveUser
                        key={member.id}
                        name={member.name}
                        status="online"
                      />
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
