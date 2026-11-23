"use strict";

export const STORAGE_VERSION = 1;

/**
 * Проверяет, является ли массив задач корректным.
 */
export function isValidTaskList(tasks) {
  if (!Array.isArray(tasks)) return false;

  const ids = new Set();
  
  for (const task of tasks) {
    // 1. Проверка ID
    if (!Number.isSafeInteger(task.id) || task.id <= 0) return false;
    if (ids.has(task.id)) return false; // дубликат
    ids.add(task.id);

    // 2. Проверка Title
    if (typeof task.title !== "string") return false;
    const cleanTitle = task.title.trim();
    if (cleanTitle.length < 1 || cleanTitle.length > 100) return false;

    // 3. Проверка Completed
    if (typeof task.completed !== "boolean") return false;

    // 4. Проверка Priority
    if (!["low", "medium", "high"].includes(task.priority)) return false;
  }

  return true;
}

/**
 * Загружает задачи из хранилища. 
 * Если там пусто или ошибка — возвращает копию fallbackTasks.
 */
export function loadTasks(storage, key, fallbackTasks) {
  // Делаем независимую копию исходного набора
  const fallbackCopy = fallbackTasks.map((t) => ({ ...t }));

  try {
    const raw = storage.getItem(key);
    
    // Если ключа нет — возвращаем исходный набор
    if (raw === null) {
      return { ok: true, source: "initial", tasks: fallbackCopy };
    }

    // Пытаемся распарсить JSON
    const parsed = JSON.parse(raw);

    // Проверяем версию и схему
    if (parsed.version !== STORAGE_VERSION || !isValidTaskList(parsed.tasks)) {
      throw new Error("Некорректная схема сохранённых данных");
    }

    // Возвращаем копию сохраненных задач
    const storedCopy = parsed.tasks.map((t) => ({ ...t }));
    return { ok: true, source: "storage", tasks: storedCopy };

  } catch (err) {
    // Если была ошибка чтения или парсинга — возвращаем fallback и текст ошибки
    return { ok: false, source: "fallback", tasks: fallbackCopy, error: err.message };
  }
}

/**
 * Сохраняет задачи в хранилище.
 */
export function saveTasks(storage, key, tasks) {
  if (!isValidTaskList(tasks)) {
    return { ok: false, error: "Попытка сохранить некорректный список задач" };
  }

  try {
    const wrapper = { version: STORAGE_VERSION, tasks: tasks };
    storage.setItem(key, JSON.stringify(wrapper));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Ошибка записи в хранилище: " + err.message };
  }
}

/**
 * Удаляет сохранённые задачи (при сбросе).
 */
export function removeSavedTasks(storage, key) {
  try {
    storage.removeItem(key);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Ошибка удаления из хранилища: " + err.message };
  }
}