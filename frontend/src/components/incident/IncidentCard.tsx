import dayjs from "dayjs";
import type { Incident } from "../../types/incident";

function formatStatus(v: Incident["status"]) {
  switch (v) {
    case "open":
      return "Open";
    case "in_progress":
      return "In Progress";
    case "success":
      return "Success";
    default:
      return v;
  }
}

function formatCategory(v: Incident["category"]) {
  switch (v) {
    case "safety":
      return "Safety";
    case "maintenance":
      return "Maintenance";
    default:
      return v;
  }
}

function statusPillClass(v: Incident["status"]) {
  switch (v) {
    case "open":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "in_progress":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function IncidentCard({
  data,
  onEdit,
  onDelete,
  dragHandleProps,
}: {
  data: Incident;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}) {
  const created = dayjs(data.created_at);
  const updated = dayjs(data.updated_at);
  const hasEdits = updated.isValid() && created.isValid() && updated.isAfter(created);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold truncate">{data.title}</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">
              {formatCategory(data.category)}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border ${statusPillClass(
                data.status
              )}`}
            >
              {formatStatus(data.status)}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Drag"
          className="select-none cursor-grab active:cursor-grabbing text-gray-400 px-2"
          {...dragHandleProps}
        >
          ⋮⋮
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-2">{data.description}</p>

      <div className="mt-3 space-y-1 text-xs text-gray-400">
        <div>Created: {created.isValid() ? created.format("DD MMM YYYY HH:mm") : "-"}</div>
        {hasEdits && (
          <div>Last edited: {updated.format("DD MMM YYYY HH:mm")}</div>
        )}
      </div>

      <div className="flex gap-2 mt-4 justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-blue-700 text-sm px-2 py-1 rounded-lg hover:bg-blue-50"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-700 text-sm px-2 py-1 rounded-lg hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
