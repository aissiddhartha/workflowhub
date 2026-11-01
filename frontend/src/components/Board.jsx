import { useState } from "react";
import { COLUMNS } from "../constants.js";
import Column from "./Column.jsx";
import TaskModal from "./TaskModal.jsx";

export default function Board({ items, onCreate, onMove, onUpdate, onDelete }) {
  const [dragId, setDragId] = useState(null);
  const [overStatus, setOverStatus] = useState(null);
  const [editing, setEditing] = useState(null);

  const endDrag = () => {
    setDragId(null);
    setOverStatus(null);
  };

  const drop = (status) => {
    if (dragId !== null) onMove(dragId, status);
    endDrag();
  };

  return (
    <>
      <div className="board">
        {COLUMNS.map((column) => (
          <Column
            key={column.status}
            column={column}
            items={items.filter((item) => item.status === column.status)}
            dragId={dragId}
            isOver={overStatus === column.status}
            onHover={setOverStatus}
            onDragStartCard={setDragId}
            onDragEndCard={endDrag}
            onDropCard={drop}
            onCreate={onCreate}
            onEdit={setEditing}
            onDelete={onDelete}
          />
        ))}
      </div>

      {editing && (
        <TaskModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (changes) => {
            await onUpdate(editing.id, changes);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
