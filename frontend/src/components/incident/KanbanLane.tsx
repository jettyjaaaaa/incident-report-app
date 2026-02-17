import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";
import type { Incident } from "../../types/incident";

function laneHeaderClass(v: Incident["status"]) {
  switch (v) {
    case "open":
      return "bg-amber-50";
    case "in_progress":
      return "bg-sky-50";
    case "success":
      return "bg-emerald-50";
    default:
      return "bg-gray-50";
  }
}

function laneBorderClass(v: Incident["status"]) {
  switch (v) {
    case "open":
      return "border-amber-100";
    case "in_progress":
      return "border-sky-100";
    case "success":
      return "border-emerald-100";
    default:
      return "border-gray-200";
  }
}

export default function KanbanLane({
  laneId,
  title,
  count,
  sortDir,
  onToggleSort,
  children,
}: {
  laneId: Incident["status"];
  title: string;
  count: number;
  sortDir: "asc" | "desc";
  onToggleSort: () => void;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: laneId });

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden ${laneBorderClass(laneId)}`}>
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${laneHeaderClass(
          laneId
        )} ${laneBorderClass(laneId)}`}
      >
        <div className="flex items-center gap-2">
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-gray-600 bg-white/70 border rounded-full px-2 py-0.5">
            {count}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleSort}
          className="text-sm text-gray-600 hover:text-black px-2 py-1 rounded-lg border bg-white"
          aria-label="Toggle sort direction"
          title={sortDir === "desc" ? "Newest first" : "Oldest first"}
        >
          {sortDir === "desc" ? "↓" : "↑"}
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={
          "p-3 space-y-3 overflow-y-auto h-[70vh] min-h-[240px] " +
          (isOver ? "bg-gray-50" : "bg-white")
        }
      >
        {children}
      </div>
    </div>
  );
}
