export function TaskItem({ task, categoryName, onToggle, onEdit, onDelete }) {
  const priorityText = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
  };

  return (
    <li className={`task-card ${task.completed ? "is-completed" : ""}`}>
      <h3 className="task-title">{task.title}</h3>
      
      <div className="task-meta">
        <span className="task-status">
          {task.completed ? "Выполнена" : "В работе"}
        </span>
        <span className="task-priority">
          {priorityText[task.priority] || task.priority}
        </span>
        <span className="task-category">
          {categoryName || "Без категории"}
        </span>
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => onToggle(task.id)}>
          {task.completed ? "Вернуть в работу" : "Выполнена"}
        </button>
        <button type="button" onClick={() => onEdit(task.id)}>
          Изменить
        </button>
        <button type="button" onClick={() => onDelete(task.id)}>
          Удалить
        </button>
      </div>
    </li>
  );
}