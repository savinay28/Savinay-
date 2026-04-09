"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Loader2, Clock } from "lucide-react";

export function HistoryList() {
  const history = useQuery("history:getHistory" as any);
  const router = useRouter();

  if (history === undefined) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-6 text-sm text-slate-500 text-center">
        No history yet. Start generating!
      </div>
    );
  }

  const handleOpen = (item: any) => {
    const encodedData = encodeURIComponent(JSON.stringify(item.data));
    router.push(`/${item.mode}?data=${encodedData}`);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Clock className="w-4 h-4" /> Recent Activity
      </h2>
      <div className="flex flex-col gap-2 overflow-y-auto w-full">
        {history.map((item) => (
          <button
            key={item._id}
            onClick={() => handleOpen(item)}
            className="flex flex-col items-start p-3 bg-white rounded-lg hover:bg-slate-50 transition-colors border border-slate-100 shadow-sm hover:border-slate-200 text-left w-full"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-semibold text-sm text-slate-700 truncate max-w-[140px]" title={item.topic}>
                {item.topic}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0 ${
                  item.mode === "quiz"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {item.mode}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
              })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
