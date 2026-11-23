import { Router } from "express";
import { ApiError } from "./errors.js";
import { parsePositiveId, parseFilters } from "./validation.js";
import { selectTasks, findTask } from "./task-service.js";

export function createRouter(store) {
  const router = Router();

  // 1. GET-маршруты
  router.get("/health", (req, res) => {
    res.json({ data: { status: "ok" } });
  });

  router.get("/categories", (req, res) => {
    const data = store.listCategories();
    res.json({ data, meta: { total: data.length } });
  });

  router.get("/tasks", (req, res) => {
    const url = new URL(req.originalUrl, "http://localhost");
    const filters = parseFilters(url.searchParams);
    const data = store.listTasks(filters); 
    res.json({ data, meta: { total: data.length, filters } });
  });

  router.get("/tasks/:id", (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (id === null) {
      throw new ApiError(400, "INVALID_ID", "Некорректный ID задачи");
    }
    const task = store.getTask(id);
    if (!task) {
      throw new ApiError(404, "TASK_NOT_FOUND", "Задача не найдена", { id });
    }
    res.json({ data: task });
  });

  // 2. Перехват 405 для известных путей.
  // Внимание: используем строгое сравнение, чтобы /tasks/4/extra не считался известным путем.
  router.use((req, res, next) => {
    const isKnown = req.path === "/health" || 
                    req.path === "/categories" || 
                    req.path === "/tasks" || 
                    /^\/tasks\/[^/]+$/.test(req.path); // строго /tasks/:id (без доп. слешей)
                    
    if (isKnown) {
      res.setHeader("Allow", "GET, HEAD, OPTIONS");
      return next(new ApiError(405, "METHOD_NOT_ALLOWED", "Метод не поддерживается"));
    }
    
    // Если путь неизвестен (например, /tasks/4/extra), пропускаем дальше (сработает 404)
    next();
  });

  return router;
}