export function validateTaskDraft(draft, categories) {
  const errors = {};
  let validTitle = "";
  let validPriority = draft.priority;
  let validCategoryId = null;

  // 1. Проверка названия
  if (typeof draft.title !== "string") {
    errors.title = "Название должно быть строкой";
  } else {
    validTitle = draft.title.trim();
    if (validTitle.length < 1 || validTitle.length > 100) {
      errors.title = "Длина названия должна быть от 1 до 100";
    }
  }

  // 2. Проверка приоритета
  if (!["low", "medium", "high"].includes(validPriority)) {
    errors.priority = "Приоритет должен быть low, medium или high";
  }

  // 3. Проверка категории (преобразуем в число)
  const catId = Number(draft.categoryId);
  if (!Number.isSafeInteger(catId) || catId <= 0) {
    errors.categoryId = "Неверная категория";
  } else if (!categories.some((c) => c.id === catId)) {
    errors.categoryId = "Категория не найдена";
  } else {
    validCategoryId = catId;
  }

  // 4. Итог
  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    value: { title: validTitle, priority: validPriority, categoryId: validCategoryId },
    errors: {}
  };
}

// ФИЛЬТРАЦИЯ (поиск + фильтры)
export function selectTasks(tasks, filters) {
  return tasks.filter((task) => {
    // Поиск по названию
    if (filters.q) {
      const q = filters.q.trim().toLowerCase();
      if (!task.title.toLowerCase().includes(q)) return false;
    }
    
    // Статус (явное сравнение со строкой, как требует методичка)
    if (filters.completed === "true" && !task.completed) return false;
    if (filters.completed === "false" && task.completed) return false;
    
    // Приоритет
    if (filters.priority && task.priority !== filters.priority) return false;
    
    // Категория
    if (filters.categoryId && task.categoryId !== Number(filters.categoryId)) return false;

    return true;
  });
}

// СТАТИСТИКА
export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  return { total, completed, active: total - completed };
}

// СОЗДАНИЕ
export function addTask(tasks, value, id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Некорректный id");
  }
  if (tasks.some((t) => t.id === id)) {
    throw new Error("Задача с таким id уже существует");
  }
  
  const newTask = {
    id: id,
    title: value.title,
    priority: value.priority,
    categoryId: value.categoryId,
    completed: false
  };
  
  return [...tasks, newTask];
}

// ОБНОВЛЕНИЕ (редактирование)
export function updateTask(tasks, id, value) {
  return tasks.map((task) => {
    if (task.id === id) {
      return { ...task, title: value.title, priority: value.priority, categoryId: value.categoryId };
    }
    return task;
  });
}

// ПЕРЕКЛЮЧЕНИЕ СТАТУСА
export function toggleTask(tasks, id) {
  return tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
}

// УДАЛЕНИЕ
export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}