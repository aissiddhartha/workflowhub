import { useState } from "react";
import { PRIORITIES } from "../constants.js";
import TaskCard from "./TaskCard.jsx";

export default function Column({
  column,
  items,
  dragId,
  isOver,
  onHover,
  onDragStartCard,
  onDragEndCard,
  onDropCard,
  onCreate,
  onEdit,
  onDelete,
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  const reset = () => {
    setTitle("");
    setPriority("Medium");
    setAdding(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await onCreate({ title: trimmed, status: column.status, priority });
    reset();
  };

  return (
    <section
      className={`column${column.done ? " column--done" : ""}${isOver ? " column--over" : ""}`}
      data-status={column.status}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onHover(column.status);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onHover(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropCard(column.status);
      }}
    >
      <header className="column__header">
        <div className="column__title">
          <h2>{column.status}</h2>
          <span className="count" title={`${items.length} in ${column.status}`}>
            {items.length}
          </span>
        </div>
      </header>

      <div className="column__cards">
        {items.map((item) => (
          <TaskCard
            key={item.id}
            item={item}
            dragging={dragId === item.id}
            onDragStart={() => onDragStartCard(item.id)}
            onDragEnd={onDragEndCard}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </div>

      {adding ? (
        <form className="add-form" onSubmit={submit}>
          <input
            autoFocus
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && reset()}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <div className="add-form__actions">
            <button type="submit" className="btn btn--primary btn--small">
              Add
            </button>
            <button type="button" className="btn btn--small" onClick={reset}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="add-button" onClick={() => setAdding(true)}>
          + Add task
        </button>
      )}
    </section>
  );
}