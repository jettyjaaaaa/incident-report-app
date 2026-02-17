import { useEffect, useMemo, useState } from "react";
import {
  getIncidents,
  deleteIncident,
  updateIncident,
} from "../api/incidentApi";

import IncidentCard from "../components/incident/IncidentCard";
import SearchBar from "../components/incident/SearchBar";
import SortDropdown from "../components/incident/SortDropdown";
import IncidentFormModal from "../components/incident/IncidentFormModal";
import KanbanLane from "../components/incident/KanbanLane";
import DraggableIncidentCard from "../components/incident/DraggableIncidentCard";
import ConfirmDeleteModal from "../components/incident/ConfirmDeleteModal";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { Incident } from "../types/incident";

type SortMode = "created_at" | "updated_at" | "safety_first" | "maintenance_first";

const STATUS_LANES: Array<{ id: Incident["status"]; title: string }> = [
  { id: "open", title: "Open" },
  { id: "in_progress", title: "In Progress" },
  { id: "success", title: "Success" },
];

function sortIncidents(list: Incident[], sortMode: string) {
  const items = [...list];
  const byDateDesc = (key: "created_at" | "updated_at") =>
    items.sort(
      (a, b) =>
        new Date(b[key]).getTime() -
        new Date(a[key]).getTime()
    );

  if (sortMode === "created_at" || sortMode === "updated_at") {
    return byDateDesc(sortMode);
  }

  const categoryPriority =
    sortMode === "maintenance_first"
      ? { maintenance: 0, safety: 1 }
      : { safety: 0, maintenance: 1 };

  return items.sort((a, b) => {
    const ca = categoryPriority[a.category] ?? 99;
    const cb = categoryPriority[b.category] ?? 99;
    if (ca !== cb) return ca - cb;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export default function Dashboard() {
  const [list, setList] = useState<Incident[]>([]);
  const [q, setQ] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("created_at");
  const [categoryFilter, setCategoryFilter] = useState<"" | Incident["category"]>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Incident | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [laneSortDir, setLaneSortDir] = useState<
    Record<Incident["status"], "asc" | "desc">
  >({
    open: "desc",
    in_progress: "desc",
    success: "desc",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const load = async () => {
    try {
      setLoading(true);
      const sortBy =
        sortMode === "updated_at" || sortMode === "created_at"
          ? sortMode
          : "created_at";

      const res = await getIncidents({ q, sortBy, sortDir: "desc", limit: 200 });

      setList(res?.data || []);
    } catch (err) {
      console.error("load incidents error:", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [q, sortMode]);

  const filtered = useMemo(() => {
    const items = list;
    const nextCategory = categoryFilter;

    const dateField: "created_at" | "updated_at" =
      sortMode === "updated_at" ? "updated_at" : "created_at";

    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

    return items.filter((i) => {
      if (nextCategory && i.category !== nextCategory) return false;

      if (from || to) {
        const t = new Date(i[dateField]).getTime();
        if (Number.isNaN(t)) return false;
        if (from && t < from.getTime()) return false;
        if (to && t > to.getTime()) return false;
      }

      return true;
    });
  }, [list, categoryFilter, dateFrom, dateTo, sortMode]);

  const grouped = useMemo(() => {
    const byStatus: Record<Incident["status"], Incident[]> = {
      open: [],
      in_progress: [],
      success: [],
    };

    for (const item of filtered) {
      byStatus[item.status]?.push(item);
    }

    for (const lane of STATUS_LANES) {
      const sorted = sortIncidents(byStatus[lane.id] || [], sortMode);
      byStatus[lane.id] =
        laneSortDir[lane.id] === "asc" ? [...sorted].reverse() : sorted;
    }

    return byStatus;
  }, [filtered, sortMode, laneSortDir]);

  const activeIncident = useMemo(() => {
    if (!activeId) return null;
    return list.find((i) => i.id === activeId) || null;
  }, [activeId, list]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!active?.id || !over?.id) return;
    const id = String(active.id);
    const nextStatus = String(over.id) as Incident["status"];

    const current = list.find((i) => i.id === id);
    if (!current) return;
    if (current.status === nextStatus) return;

    const prevStatus = current.status;
    const optimistic: Incident = {
      ...current,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    };

    setList((prev) => prev.map((i) => (i.id === id ? optimistic : i)));

    try {
      await updateIncident(id, {
        title: current.title,
        description: current.description,
        category: current.category,
        status: nextStatus,
      });
      await load();
    } catch (e) {
      console.error("update status failed:", e);
      setList((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: prevStatus } : i))
      );
      window.alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-2xl p-3 flex gap-2 flex-wrap items-end">
        <div className="flex-1 min-w-[240px]">
          <div className="text-xs text-gray-500 mb-1">Search</div>
          <SearchBar value={q} onChange={setQ} />
        </div>

        <div className="min-w-[180px]">
          <div className="text-xs text-gray-500 mb-1">Sort</div>
          <SortDropdown value={sortMode} onChange={setSortMode} />
        </div>

        <div className="min-w-[180px]">
          <div className="text-xs text-gray-500 mb-1">Category</div>
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as "" | Incident["category"])
            }
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">All</option>
            <option value="safety">Safety</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="min-w-[160px]">
          <div className="text-xs text-gray-500 mb-1">Date from</div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="min-w-[160px]">
          <div className="text-xs text-gray-500 mb-1">Date to</div>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setOpenModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + New
        </button>
      </div>

      {/* loading state */}
      {loading && (
        <div className="text-gray-500 text-sm">Loading incidents...</div>
      )}

      {/* empty state */}
      {!loading && list.length === 0 && (
        <div className="text-gray-400 text-sm">No incidents yet</div>
      )}

      {/* kanban lanes */}
      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(String(e.active.id))}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {STATUS_LANES.map((lane) => (
            <KanbanLane
              key={lane.id}
              laneId={lane.id}
              title={lane.title}
              count={(grouped[lane.id] || []).length}
              sortDir={laneSortDir[lane.id]}
              onToggleSort={() =>
                setLaneSortDir((prev) => ({
                  ...prev,
                  [lane.id]: prev[lane.id] === "desc" ? "asc" : "desc",
                }))
              }
            >
              {(grouped[lane.id] || []).map((item) => (
                <DraggableIncidentCard
                  key={item.id}
                  item={item}
                  onEdit={() => {
                    setEditing(item);
                    setOpenModal(true);
                  }}
                  onDelete={() => setConfirmDelete(item)}
                />
              ))}
            </KanbanLane>
          ))}
        </div>

        <DragOverlay>
          {activeIncident ? (
            <div className="w-[340px]">
              <IncidentCard
                data={activeIncident}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <ConfirmDeleteModal
        open={Boolean(confirmDelete)}
        title={confirmDelete?.title || ""}
        loading={deleteLoading}
        onCancel={() => {
          if (deleteLoading) return;
          setConfirmDelete(null);
        }}
        onConfirm={async () => {
          if (!confirmDelete) return;
          setDeleteLoading(true);
          try {
            await deleteIncident(confirmDelete.id);
            setConfirmDelete(null);
            await load();
          } finally {
            setDeleteLoading(false);
          }
        }}
      />

      <IncidentFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        initial={editing}
        onSaved={load}
      />
    </div>
  );
}
