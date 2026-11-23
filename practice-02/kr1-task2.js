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
// Функция getPendingTasks — скопирована из task-service.js
// ============================================================
function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

// ============================================================
// Проверочные вызовы
// ============================================================

// 1) На общем наборе demoTasks
const pendingDemo = getPendingTasks(demoTasks);
console.log("1) getPendingTasks(demoTasks) → id:", pendingDemo.map((t) => t.id));

// 2) На пустом массиве
const pendingEmpty = getPendingTasks([]);
console.log("2) getPendingTasks([]) →", pendingEmpty);

// 3) Дополнительно: исходный массив не изменился
console.log("3) demoTasks не изменился — id:", demoTasks.map((t) => t.id));