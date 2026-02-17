import { useEffect, useMemo, useState } from "react";
import { createIncident, updateIncident } from "../../api/incidentApi";
import type { Incident } from "../../types/incident";

export default function IncidentFormModal({
  open,
  onClose,
  initial,
  onSaved,
}: any) {
  const isEditing = useMemo(() => Boolean(initial?.id), [initial?.id]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Incident["category"]>("safety");
  const [status, setStatus] = useState<Incident["status"]>("open");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setCategory((initial?.category as Incident["category"]) || "safety");
    setStatus((initial?.status as Incident["status"]) || "open");
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const submit = async () => {
    const nextTitle = title.trim();
    const nextDescription = description.trim();
    if (!nextTitle || !nextDescription || !category || !status) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (initial?.id) {
        await updateIncident(initial.id, {
          title: nextTitle,
          description: nextDescription,
          category,
          status,
        });
      } else {
        await createIncident({
          title: nextTitle,
          description: nextDescription,
          category,
          status,
        });
      }
      onSaved();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 border shadow-sm">
        <h2 className="font-semibold text-lg">
          {isEditing ? "Edit Incident" : "Create Incident"}
        </h2>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value as Incident["category"])}
          >
            <option value="safety">Safety</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value as Incident["status"])}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="success">Success</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
