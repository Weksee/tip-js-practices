import { ApiError } from "./errors.js";

export function parsePositiveId(raw) {
  if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) {
    return null;
  }
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : null;
}

export function parseFilters(searchParams) {
  const allowed = ["completed", "priority", "categoryId", "q"];
  
  // Проверка на неизвестные параметры
  for (const key of searchParams.keys()) {
    if (!allowed.includes(key)) {
      throw new ApiError(400, "INVALID_QUERY", `Неизвестный параметр: ${key}`);
    }
  }

  const filters = { completed: null, priority: null, categoryId: null, q: "" };

  // Проверка completed
  const completedArr = searchParams.getAll("completed");
  if (completedArr.length > 1) throw new ApiError(400, "INVALID_QUERY", "Повторяющийся параметр completed");
  if (completedArr.length === 1) {
    if (completedArr[0] === "true") filters.completed = true;
    else if (completedArr[0] === "false") filters.completed = false;
    else throw new ApiError(400, "INVALID_QUERY", "Неверное значение completed");
  }

  // Проверка priority
  const priorityArr = searchParams.getAll("priority");
  if (priorityArr.length > 1) throw new ApiError(400, "INVALID_QUERY", "Повторяющийся параметр priority");
  if (priorityArr.length === 1) {
    if (["low", "medium", "high"].includes(priorityArr[0])) filters.priority = priorityArr[0];
    else throw new ApiError(400, "INVALID_QUERY", "Неверное значение priority");
  }

  // Проверка categoryId
  const catArr = searchParams.getAll("categoryId");
  if (catArr.length > 1) throw new ApiError(400, "INVALID_QUERY", "Повторяющийся параметр categoryId");
  if (catArr.length === 1) {
    const id = parsePositiveId(catArr[0]);
    if (id === null) throw new ApiError(400, "INVALID_QUERY", "Неверное значение categoryId");
    filters.categoryId = id;
  }

  // Проверка q
  const qArr = searchParams.getAll("q");
  if (qArr.length > 1) throw new ApiError(400, "INVALID_QUERY", "Повторяющийся параметр q");
  if (qArr.length === 1) {
    const q = qArr[0].trim();
    if (q.length > 100) throw new ApiError(400, "INVALID_QUERY", "Слишком длинный запрос q");
    filters.q = q;
  }

  return filters;
}