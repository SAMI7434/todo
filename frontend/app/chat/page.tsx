"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContent";

export default function ChatPage() {
  const router = useRouter();
  const { user, isReady, logout } = useAuth();

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Signed in as</p>
            <h1 className="text-2xl font-semibold">{user.name}</h1>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
          >
            Sign out
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-xl font-semibold">Pick a room</h2>
          <p className="mt-2 text-sm text-slate-400">
            Start chatting with your team.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {["general", "product", "support"].map((room) => (
              <Link
                key={room}
                href={`/chat/${room}`}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-amber-400 hover:text-amber-200"
              >
                #{room}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
