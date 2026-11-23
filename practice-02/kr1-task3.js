"use strict";

// ============================================================
// Массив demoTasks из ПР2–ПР3
// ============================================================
const demoTasks = [
  { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
  { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
  { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
  { id: 10, title: "Оформить README", completed: true, priority: "medium" },
];

// ============================================================
// Функция setTaskCompleted — скопирована из task-service.js
// ============================================================
function setTaskCompleted(tasks, id, completed) {
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

// ============================================================
// Вызов 1: успешная установка completed = true для id=4
// ============================================================
console.log("=== Вызов 1: setTaskCompleted(demoTasks, 4, true) ===");
const result1 = setTaskCompleted(demoTasks, 4, true);
console.log("ok:", result1.ok);
console.log("Новая задача id=4:", result1.tasks.find((t) => t.id === 4));
console.log("Исходная задача id=4:", demoTasks.find((t) => t.id === 4));
console.log("Исходный массив не изменился:", demoTasks.find((t) => t.id === 4).completed === false);

// ============================================================
// Вызов 2: отказ — задачи с id=777 нет
// ============================================================
console.log("\n=== Вызов 2: setTaskCompleted(demoTasks, 777, true) ===");
const result2 = setTaskCompleted(demoTasks, 777, true);
console.log("Результат:", result2);
console.log("Исходный массив не изменился:", demoTasks.length === 4);