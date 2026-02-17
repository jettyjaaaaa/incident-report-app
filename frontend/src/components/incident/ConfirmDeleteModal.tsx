export default function ConfirmDeleteModal({
  open,
  title,
  onCancel,
  onConfirm,
  loading,
}: {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border shadow-sm p-5 space-y-3">
        <div className="font-semibold text-lg">Delete incident?</div>
        <div className="text-sm text-gray-600">
          This will move <span className="font-medium">{title}</span> to Deleted
          History.
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
