"use strict";
import { createApiClient } from "./api-client.js";
import { createTaskApi } from "./task-api.js";
import { variantNumber, variantFilters } from "./variant.js";

const API_URL = process.env.API_URL || "http://127.0.0.1:5505/api";

async function run() {
  console.log(`Используется API: ${API_URL}`);
  const client = createApiClient({ baseUrl: API_URL });
  const api = createTaskApi(client);

  try {
    console.log("\n--- 1. Проверка health ---");
    const health = await client.requestJson("/health");
    console.log(health);

    console.log("\n--- 2. Все задачи ---");
    const all = await api.getTasks();
    console.log(`Получено задач: ${all.tasks.length}`);
    console.log("ID:", all.tasks.map(t => t.id));

    console.log("\n--- 3. Задачи высокого приоритета ---");
    const high = await api.getTasks({ priority: "high" });
    console.log("ID:", high.tasks.map(t => t.id));

    console.log("\n--- 4. Задача по ID (25) ---");
    const task25 = await api.getTaskById(25);
    console.log(task25);

    console.log("\n--- 5. Ошибка 404 ---");
    try {
      await api.getTaskById(999);
    } catch (e) {
      console.log(`Поймана ошибка: kind=${e.kind}, status=${e.status}, message=${e.message}`);
    }

    console.log("\n--- 6. Параллельная загрузка ---");
    const initial = await api.loadInitialData();
    console.log(`Задач: ${initial.tasks.length}, Категорий: ${initial.categories.length}`);

    console.log("\n--- 7. Индивидуальный вариант ---");
    console.log(`Вариант: ${variantNumber}, Фильтры:`, variantFilters);
    const variantData = await api.getTasks(variantFilters);
    console.log("ID варианта:", variantData.tasks.map(t => t.id));

  } catch (error) {
    console.error("\nКРИТИЧЕСКАЯ ОШИБКА:", error);
    process.exit(1);
  }
}

run();