export default function TaskCard({ item, dragging, onDragStart, onDragEnd, onEdit, onDelete }) {
  return (
    <article
      className={`card${dragging ? " card--dragging" : ""}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(item.id));
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      data-id={item.id}
    >
      <h3 className="card__title">{item.title}</h3>

      {item.description && <p className="card__desc">{item.description}</p>}

      <div className="card__footer">
        <span className={`priority priority--${item.priority.toLowerCase()}`}>{item.priority}</span>
        <div className="card__actions">
          <button className="icon-btn" title="Edit" aria-label="Edit task" onClick={onEdit}>
            ✎
          </button>
          <button
            className="icon-btn icon-btn--danger"
            title="Delete"
            aria-label="Delete task"
            onClick={() => {
              if (window.confirm("Delete this task?")) onDelete();
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </article>
  );
}