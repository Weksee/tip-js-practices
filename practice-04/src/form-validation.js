/**
 * Проверяет черновик задачи.
 * @param {object} draft - { id, title, priority }
 * @param {Array} tasks - текущий массив всех задач
 * @param {number|null} editingId - id редактируемой задачи (или null, если создаем новую)
 * @returns {object} { ok: true, value: {...} } или { ok: false, errors: { id: '...', title: '...' } }
 */
export function validateTaskDraft(draft, tasks, editingId = null) {
  const errors = {};
  let validId = null;

  // --- 1. Проверка ID ---
  if (editingId !== null) {
    // Режим РЕДАКТИРОВАНИЯ: ID берем из editingId, а не из формы
    if (!Number.isSafeInteger(editingId) || editingId <= 0) {
      errors.id = "Некорректный id редактируемой задачи";
    } else {
      const exists = tasks.some((t) => t.id === editingId);
      if (!exists) {
        errors.id = "Редактируемая задача не найдена";
      } else {
        validId = editingId;
      }
    }
  } else {
    // Режим СОЗДАНИЯ: берем ID из формы
    const rawId = draft.id;
    // Пустая строка не должна превращаться в 0
    if (typeof rawId === "string" && rawId.trim() === "") {
      errors.id = "Введите id задачи";
    } else {
      const numId = Number(rawId);
      if (!Number.isSafeInteger(numId) || numId <= 0) {
        errors.id = "id должен быть положительным целым числом";
      } else if (tasks.some((t) => t.id === numId)) {
        errors.id = "Задача с таким id уже существует";
      } else {
        validId = numId;
      }
    }
  }

  // --- 2. Проверка Title (названия) ---
  let validTitle = "";
  if (typeof draft.title !== "string") {
    errors.title = "Название должно быть строкой";
  } else {
    validTitle = draft.title.trim();
    if (validTitle.length === 0) {
      errors.title = "Название не может быть пустым";
    } else if (validTitle.length > 100) {
      errors.title = "Название не должно превышать 100 символов";
    }
  }

  // --- 3. Проверка Priority (приоритета) ---
  let validPriority = draft.priority;
  if (!["low", "medium", "high"].includes(validPriority)) {
    errors.priority = "Приоритет должен быть low, medium или high";
  }

  // --- 4. Возврат результата ---
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      id: validId,
      title: validTitle,
      priority: validPriority
    }
  };
}