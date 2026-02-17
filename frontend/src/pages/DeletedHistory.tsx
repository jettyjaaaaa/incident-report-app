import { useEffect, useState } from "react";
import { getDeleted, restoreIncident } from "../api/incidentApi";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export default function DeletedHistory() {
  const [list, setList] = useState<any[]>([]);

  const load = async () => {
    const res = await getDeleted();
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Deleted Incidents</h2>
        <Link
          to="/"
          className="text-sm px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
        >
          ← Home
        </Link>
      </div>

      {list.map((i) => (
        <div key={i.id} className="bg-white border p-4 rounded-xl">
          <div className="flex justify-between">
            <h3 className="font-semibold">{i.title}</h3>
            <span className="text-xs text-gray-400">
              Deleted: {dayjs(i.deleted_at).format("DD MMM")}
            </span>
          </div>

          <p className="text-sm text-gray-600">{i.description}</p>

          <button
            onClick={async () => {
              await restoreIncident(i.id);
              load();
            }}
            className="text-blue-600 mt-2"
          >
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}
