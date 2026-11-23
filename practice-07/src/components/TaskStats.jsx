export function TaskStats({ stats }) {
  return (
    <div className="task-stats">
      <div>
        <span>Всего:</span>
        <strong>{stats.total}</strong>
      </div>
      <div>
        <span>Выполнено:</span>
        <strong>{stats.completed}</strong>
      </div>
      <div>
        <span>В работе:</span>
        <strong>{stats.active}</strong>
      </div>
    </div>
  );
}