import { useState } from "react";
import { validateTaskDraft } from "../domain/task-service.js";

export function TaskForm({ categories, initialTask, onSave, onCancel }) {
  // Инициализируем черновик. Если есть initialTask (редактирование) — берем из нее.
  const [draft, setDraft] = useState(() => {
    if (initialTask) {
      return {
        title: initialTask.title,
        priority: initialTask.priority,
        categoryId: String(initialTask.categoryId), // select работает со строками
      };
    }
    return {
      title: "",
      priority: "medium",
      categoryId: categories[0] ? String(categories[0].id) : "",
    };
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateTaskDraft(draft, categories);
    
    if (!result.valid) {
      setErrors(result.errors);
      return; // Не сохраняем, если есть ошибки
    }

    setErrors({});
    const success = onSave(result.value); // Возвращает true или false
    
    if (success) {
      // Если создали новую (не редактирование), очищаем форму
      if (!initialTask) {
        setDraft({
          title: "",
          priority: "medium",
          categoryId: categories[0] ? String(categories[0].id) : "",
        });
      }
    }
  };

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку этого поля при вводе
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>{initialTask ? "Редактирование задачи" : "Добавление задачи"}</h2>

      <div className="form-group">
        <label htmlFor="title">Название</label>
        <input
          id="title"
          type="text"
          value={draft.title}
          onChange={(e) => handleChange("title", e.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <span id="title-error" className="error-text" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="priority">Приоритет</label>
        <select
          id="priority"
          value={draft.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="category">Категория</label>
        <select
          id="category"
          value={draft.categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          aria-invalid={Boolean(errors.categoryId)}
          aria-describedby={errors.categoryId ? "category-error" : undefined}
        >
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <span id="category-error" className="error-text" role="alert">
            {errors.categoryId}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit">Сохранить</button>
        {initialTask && (
          <button type="button" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}