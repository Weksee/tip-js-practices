"use strict";

/**
 * Создаёт объект задачи после проверки аргументов.
 *
 * @param {number} id — положительное безопасное целое
 * @param {string} title — строка длиной 1..100 после trim()
 * @param {string} priority — "low" | "medium" | "high", по умолчанию "medium"
 * @returns {{ ok: true, task: object } | { ok: false, error: string }}
 */
export function createTask(id, title, priority = "medium") {

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

 
  if (typeof title !== "string") {
    return { ok: false, error: "Название должно быть строкой" };
  }

  const cleanTitle = title.trim();

  if (cleanTitle.length < 1 || cleanTitle.length > 100) {
    return { ok: false, error: "Длина названия должна быть от 1 до 100" };
  }


  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return { ok: false, error: "Приоритет должен быть low, medium или high" };
  }


  return {
    ok: true,
    task: {
      id: id,
      title: cleanTitle,
      completed: false,
      priority: priority,
    },
  };
}


// ============================================================
// Задание 3
// ============================================================

/**
 * Находит первую задачу с указанным id.
 * @returns объект задачи или undefined, если не найдено
 */
export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

/**
 * Возвращает новый массив невыполненных задач (completed === false).
 * Порядок сохраняется.
 */
export function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

/**
 * Возвращает новый массив названий всех задач.
 * Порядок сохраняется.
 */
export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

/**
 * Считает сводку по массиву задач.
 * progress не округляется — это число.
 */
export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed === true).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;

  return { total, completed, pending, progress };
}

// ============================================================
// Задание 4. Добавление, изменение, удаление
// ============================================================

/**
 * Добавляет новую задачу в конец нового массива.
 * Проверяет поля через createTask и уникальность id.
 */
export function addTask(tasks, id, title, priority = "medium") {
  const created = createTask(id, title, priority);

  if (!created.ok) {
    return created;
  }

  const exists = tasks.some((task) => task.id === id);
  if (exists) {
    return { ok: false, error: "Задача с таким id уже существует" };
  }

  return { ok: true, tasks: [...tasks, created.task] };
}

/**
 * Меняет completed указанной задачи. Другие поля сохраняются.
 */
export function setTaskCompleted(tasks, id, completed) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  if (typeof completed !== "boolean") {
    return { ok: false, error: "completed должен быть true или false" };
  }

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: "Задача не найдена" };
  }

  const newTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed } : task
  );

  return { ok: true, tasks: newTasks };
}

/**
 * Меняет title указанной задачи. Другие поля сохраняются.
 */
export function renameTask(tasks, id, title) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  if (typeof title !== "string") {
    return { ok: false, error: "Название должно быть строкой" };
  }

  const cleanTitle = title.trim();

  if (cleanTitle.length < 1 || cleanTitle.length > 100) {
    return { ok: false, error: "Длина названия должна быть от 1 до 100" };
  }

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: "Задача не найдена" };
  }

  const newTasks = tasks.map((task) =>
    task.id === id ? { ...task, title: cleanTitle } : task
  );

  return { ok: true, tasks: newTasks };
}

/**
 * Удаляет задачу с указанным id. Порядок остальных сохраняется.
 */
export function removeTask(tasks, id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  const exists = tasks.some((task) => task.id === id);
  if (!exists) {
    return { ok: false, error: "Задача не найдена" };
  }

  const newTasks = tasks.filter((task) => task.id !== id);

  return { ok: true, tasks: newTasks };
}