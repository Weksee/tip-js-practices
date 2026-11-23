export function getVisibleTasks(tasks, filter = "all") {
  if (filter === "pending") {
    return tasks.filter((task) => task.completed === false);
  }
  if (filter === "completed") {
    return tasks.filter((task) => task.completed === true);
  }
  // "all" и любое неизвестное значение — все задачи
  return tasks.slice();
}

/**
 * Обновляет название и приоритет задачи. Статус completed и id не меняются.
 */
export function updateTask(tasks, id, title, priority) {
  // 1. Проверяем id
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }
  
  // 2. Проверяем, существует ли такая задача
  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: "Задача не найдена" };
  }

  // 3. Проверяем title и priority через createTask 
  // (чтобы не дублировать код проверки, который мы уже писали)
  const check = createTask(id, title, priority);
  if (!check.ok) {
    return { ok: false, error: check.error };
  }

  // 4. Возвращаем новый массив, меняя ТОЛЬКО title и priority
  const newTasks = tasks.map((task) =>
    task.id === id 
      ? { ...task, title: check.task.title, priority: check.task.priority } 
      : task
  );

  return { ok: true, tasks: newTasks };
}