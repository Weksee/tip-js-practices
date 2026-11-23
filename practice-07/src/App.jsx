import { useState } from "react";
import { tasks as demoTasks, categories } from "./data.js";
import { selectTasks, getTaskStats, addTask, updateTask, toggleTask, removeTask } from "./domain/task-service.js";
import { TaskStats } from "./components/TaskStats.jsx";
import { TaskFilters } from "./components/TaskFilters.jsx";
import { TaskList } from "./components/TaskList.jsx";
import { TaskForm } from "./components/TaskForm.jsx";
import { createInitialFilters } from "./variant.js";

export default function App() {
  // 1. Состояния
  const [tasks, setTasks] = useState(demoTasks);
  const [filters, setFilters] = useState(createInitialFilters);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // 2. Вычисляемые данные (производные, не храним в state!)
  const visibleTasks = selectTasks(tasks, filters);
  const stats = getTaskStats(tasks);

  // 3. Обработчики
  const handleToggle = (id) => {
    setTasks((prev) => toggleTask(prev, id));
    setMessage("Статус задачи изменен.");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Удалить задачу?")) return;
    setTasks((prev) => removeTask(prev, id));
    if (editingId === id) {
      setEditingId(null); // Если удалили редактируемую — сбрасываем форму
    }
    setMessage("Задача удалена.");
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = (value) => {
    if (editingId !== null) {
      // Режим редактирования
      const exists = tasks.some((t) => t.id === editingId);
      if (!exists) {
        setMessage("Ошибка: задача для редактирования не найдена.");
        return false;
      }
      setTasks((prev) => updateTask(prev, editingId, value));
      setEditingId(null);
      setMessage("Задача обновлена.");
      return true;
    } else {
      // Режим создания
      const maxId = tasks.reduce((max, t) => Math.max(max, t.id), 0);
      const newId = maxId + 1;
      setTasks((prev) => addTask(prev, value, newId));
      setMessage("Задача создана.");
      return true;
    }
  };

  // 4. Рендер
  return (
    <div className="app-container">
      <h1>Задачи (React)</h1>
      
      <TaskStats stats={stats} />
      
      <div className="main-layout">
        <div className="sidebar">
          <TaskForm
            key={editingId ?? "new"}
            categories={categories}
            initialTask={editingId ? tasks.find((t) => t.id === editingId) : null}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        </div>
        
        <div className="content">
          <TaskFilters
            filters={filters}
            categories={categories}
            onChange={setFilters}
          />
          
          {message && (
            <div className="status-message" role="status">
              {message}
            </div>
          )}

          <TaskList
            tasks={visibleTasks}
            categories={categories}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}