"use strict";
import { ApiError } from "./api-client.js";

export function createTaskApi(client) {
  if (!client || typeof client.requestJson !== "function") {
    throw new TypeError("client.requestJson должен быть функцией");
  }

  function validateTask(task) {
    if (!task || typeof task !== "object") return false;
    return (
      Number.isSafeInteger(task.id) && task.id > 0 &&
      typeof task.title === "string" && task.title.trim().length > 0 && task.title.length <= 100 &&
      typeof task.completed === "boolean" &&
      ["low", "medium", "high"].includes(task.priority) &&
      Number.isSafeInteger(task.categoryId) && task.categoryId > 0
    );
  }

  function validateCategory(cat) {
    if (!cat || typeof cat !== "object") return false;
    return (
      Number.isSafeInteger(cat.id) && cat.id > 0 &&
      typeof cat.name === "string" && cat.name.length > 0
    );
  }

  return {
    async getTasks(filters = {}) {
      // Тест 19: массив [] не должен проходить
      if (filters === null || typeof filters !== "object" || Array.isArray(filters)) {
        throw new TypeError("Фильтры должны быть объектом");
      }

      const allowed = ["completed", "priority", "categoryId", "q"];
      for (const key of Object.keys(filters)) {
        if (!allowed.includes(key)) throw new TypeError(`Неизвестный фильтр: ${key}`);
      }
      
      if (filters.completed !== undefined) {
        if (typeof filters.completed !== "boolean") throw new TypeError("completed должен быть boolean");
      }
      if (filters.priority !== undefined) {
        if (!["low", "medium", "high"].includes(filters.priority)) throw new TypeError("Неверный priority");
      }
      if (filters.categoryId !== undefined) {
        if (!Number.isSafeInteger(filters.categoryId) || filters.categoryId <= 0) throw new TypeError("Неверный categoryId");
      }
      if (filters.q !== undefined) {
        // Тест 19: q не может быть числом и не может быть длиннее 100 символов
        if (typeof filters.q !== "string" || filters.q.length > 100) {
          throw new TypeError("q должен быть строкой до 100 символов");
        }
      }

      const query = {};
      if (filters.completed !== undefined) query.completed = filters.completed;
      if (filters.priority !== undefined) query.priority = filters.priority;
      if (filters.categoryId !== undefined) query.categoryId = filters.categoryId;
      if (filters.q !== undefined) query.q = filters.q.trim();

      const payload = await client.requestJson("/tasks", { query });
      
      if (!payload || !Array.isArray(payload.data)) {
        throw new ApiError("invalid-response", "Ожидался массив data");
      }
      if (payload.meta?.total !== payload.data.length) {
        throw new ApiError("invalid-response", "meta.total не совпадает с длиной data");
      }
      
      const ids = new Set();
      for (const t of payload.data) {
        if (!validateTask(t)) throw new ApiError("invalid-response", "Неверная схема задачи");
        if (ids.has(t.id)) throw new ApiError("invalid-response", "Дублирование id");
        ids.add(t.id);
      }

      return { tasks: payload.data, meta: payload.meta };
    },

    async getTaskById(id) {
      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new TypeError("id должен быть положительным целым числом");
      }
      
      const payload = await client.requestJson(`/tasks/${id}`, undefined);
      const task = payload?.data ? payload.data : payload;
      if (!validateTask(task)) {
        throw new ApiError("invalid-response", "Неверная схема задачи");
      }
      return task;
    },

    async getCategories() {
      const payload = await client.requestJson("/categories", undefined);
      if (!payload || !Array.isArray(payload.data)) {
        throw new ApiError("invalid-response", "Ожидался массив категорий");
      }
      
      const ids = new Set();
      for (const c of payload.data) {
        if (!validateCategory(c)) throw new ApiError("invalid-response", "Неверная схема категории");
        if (ids.has(c.id)) throw new ApiError("invalid-response", "Дублирование id категорий");
        ids.add(c.id);
      }
      return payload.data;
    },

    async loadInitialData(filters = {}) {
      const [tasksRes, categories] = await Promise.all([
        this.getTasks(filters),
        this.getCategories()
      ]);
      return { tasks: tasksRes.tasks, meta: tasksRes.meta, categories };
    }
  };
}