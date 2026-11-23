"use strict";
import { ApiError } from "./api-client.js";

export function createTaskApi(client) {
  if (!client || typeof client.requestJson !== "function") throw new TypeError("client обязателен");

  function validateTask(t) {
    return t && Number.isSafeInteger(t.id) && t.id > 0 &&
      typeof t.title === "string" && t.title.trim().length > 0 && t.title.length <= 100 &&
      typeof t.completed === "boolean" &&
      ["low", "medium", "high"].includes(t.priority) &&
      Number.isSafeInteger(t.categoryId) && t.categoryId > 0;
  }

  function validateCategory(c) {
    return c && Number.isSafeInteger(c.id) && c.id > 0 &&
      typeof c.name === "string" && c.name.length > 0;
  }

  return {
    async getTasks(filters = {}, options = {}) {
      if (filters === null || typeof filters !== "object" || Array.isArray(filters)) {
        throw new TypeError("Фильтры должны быть объектом");
      }
      const allowed = ["completed", "priority", "categoryId", "q"];
      for (const key of Object.keys(filters)) {
        if (!allowed.includes(key)) throw new TypeError(`Неизвестный фильтр: ${key}`);
      }
      if (filters.completed !== undefined && typeof filters.completed !== "boolean") throw new TypeError("completed должен быть boolean");
      if (filters.priority !== undefined && !["low", "medium", "high"].includes(filters.priority)) throw new TypeError("Неверный priority");
      if (filters.categoryId !== undefined && (!Number.isSafeInteger(filters.categoryId) || filters.categoryId <= 0)) throw new TypeError("Неверный categoryId");
      if (filters.q !== undefined && (typeof filters.q !== "string" || filters.q.length > 100)) throw new TypeError("Неверный q");

      const query = {};
      if (filters.completed !== undefined) query.completed = filters.completed;
      if (filters.priority !== undefined) query.priority = filters.priority;
      if (filters.categoryId !== undefined) query.categoryId = filters.categoryId;
      if (filters.q !== undefined) query.q = filters.q.trim();

      const payload = await client.requestJson("/tasks", { query, signal: options.signal });
      if (!payload || !Array.isArray(payload.data)) throw new ApiError("invalid-response", "Нет массива");
      
      const ids = new Set();
      for (const t of payload.data) {
        if (!validateTask(t)) throw new ApiError("invalid-response", "Неверная схема");
        if (ids.has(t.id)) throw new ApiError("invalid-response", "Дубликат id");
        ids.add(t.id);
      }
      return { tasks: payload.data, meta: payload.meta };
    },

    async getTaskById(id, options = {}) {
      if (!Number.isSafeInteger(id) || id <= 0) throw new TypeError("Неверный id");
      const payload = await client.requestJson(`/tasks/${id}`, { signal: options.signal });
      const task = payload?.data || payload;
      if (!validateTask(task)) throw new ApiError("invalid-response", "Неверная схема");
      return task;
    },

    async getCategories(options = {}) {
      const payload = await client.requestJson("/categories", { signal: options.signal });
      if (!payload || !Array.isArray(payload.data)) throw new ApiError("invalid-response", "Нет массива");
      
      const ids = new Set();
      for (const c of payload.data) {
        if (!validateCategory(c)) throw new ApiError("invalid-response", "Неверная схема");
        if (ids.has(c.id)) throw new ApiError("invalid-response", "Дубликат id");
        ids.add(c.id);
      }
      return payload.data;
    },

    async createTask(draft, options = {}) {
      const payload = await client.requestJson("/tasks", { method: "POST", body: draft, signal: options.signal });
      if (!payload || !validateTask(payload.data)) throw new ApiError("invalid-response", "Неверная схема");
      return payload.data;
    },

    async updateTask(id, changes, options = {}) {
      if (!Number.isSafeInteger(id) || id <= 0) throw new TypeError("Неверный id");
      const payload = await client.requestJson(`/tasks/${id}`, { method: "PATCH", body: changes, signal: options.signal });
      if (!payload || !validateTask(payload.data)) throw new ApiError("invalid-response", "Неверная схема");
      return payload.data;
    },

    async setTaskCompleted(id, completed, options = {}) {
      return this.updateTask(id, { completed }, options);
    },

    async deleteTask(id, options = {}) {
      if (!Number.isSafeInteger(id) || id <= 0) throw new TypeError("Неверный id");
      const res = await client.requestJson(`/tasks/${id}`, { method: "DELETE", signal: options.signal });
      if (res !== null) throw new ApiError("invalid-response", "Ожидался пустой ответ");
      return null;
    },

    async resetDemoData(options = {}) {
      const payload = await client.requestJson("/debug/reset", { method: "POST", signal: options.signal });
      return payload.data;
    },

    async loadInitialData(filters = {}, options = {}) {
      const [tasksRes, categories] = await Promise.all([
        this.getTasks(filters, options),
        this.getCategories(options)
      ]);
      return { tasks: tasksRes.tasks, meta: tasksRes.meta, categories };
    }
  };
}