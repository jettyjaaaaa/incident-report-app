import { useDraggable } from "@dnd-kit/core";
import type { Incident } from "../../types/incident";
import IncidentCard from "./IncidentCard";

export default function DraggableIncidentCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Incident;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-60" : "opacity-100"}
    >
      <IncidentCard
        data={item}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
