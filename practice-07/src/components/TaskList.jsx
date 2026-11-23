import { TaskItem } from "./TaskItem.jsx";

export function TaskList({ tasks, categories, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-message">Нет задач по выбранному фильтру.</p>;
  }

  return (
    <div>
      <p className="task-count">Найдено: {tasks.length}</p>
      <ul className="task-list">
        {tasks.map((task) => {
          const category = categories.find((c) => c.id === task.categoryId);
          return (
            <TaskItem
              key={task.id}
              task={task}
              categoryName={category ? category.name : ""}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </ul>
    </div>
  );
}