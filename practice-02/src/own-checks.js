"use strict";

import {
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
  getTaskStats,
  getPendingTasks,
} from "./task-service.js";

// ============================================================
// Собственная проверка 1.
// Последовательность: добавить → удалить → добавить.
// Проверяет, что удаление не сбивает порядок и id не путаются.
// ============================================================

console.log("=== Собственная проверка 1: add → remove → add ===");

let t1 = [{ id: 1, title: "A", completed: false, priority: "low" }];

t1 = addTask(t1, 2, "B").tasks;
t1 = removeTask(t1, 1).tasks;
t1 = addTask(t1, 3, "C").tasks;

console.log("Итоговые id:", t1.map((t) => t.id));   // [2, 3]
console.log("Итоговая сводка:", getTaskStats(t1));  // {total:2, completed:0, pending:2, progress:0}

// ============================================================
// Собственная проверка 2.
// Обновление первой и последней записи в одном массиве.
// Проверяет, что map затрагивает только совпавший id.
// ============================================================

console.log("\n=== Собственная проверка 2: обновление первой и последней ===");

let t2 = [
  { id: 10, title: "Первая", completed: false, priority: "low" },
  { id: 20, title: "Средняя", completed: false, priority: "medium" },
  { id: 30, title: "Последняя", completed: false, priority: "high" },
];

t2 = setTaskCompleted(t2, 10, true).tasks;
t2 = setTaskCompleted(t2, 30, true).tasks;

console.log("Выполненные id:", t2.filter((t) => t.completed).map((t) => t.id)); // [10, 30]
console.log("Невыполненные id:", getPendingTasks(t2).map((t) => t.id));         // [20]
console.log("Сводка:", getTaskStats(t2));                                       // {total:3, completed:2, pending:1, progress:66.66…}

// ============================================================
// Собственная проверка 3.
// Последовательное обновление нескольких задач.
// Проверяет, что каждое обновление возвращает новый массив
// и не затрагивает предыдущее состояние.
// ============================================================

console.log("\n=== Собственная проверка 3: последовательное обновление ===");

let t3 = [
  { id: 1, title: "A", completed: false, priority: "low" },
  { id: 2, title: "B", completed: false, priority: "low" },
  { id: 3, title: "C", completed: false, priority: "low" },
];

const step0 = t3;
const step1 = setTaskCompleted(step0, 1, true).tasks;
const step2 = setTaskCompleted(step1, 2, true).tasks;
const step3 = setTaskCompleted(step2, 3, true).tasks;

console.log("step0 — все false:", step0.every((t) => t.completed === false)); // true
console.log("step1 — id=1 true:", step1[0].completed, "id=2,3 false:", step1[1].completed, step1[2].completed);
console.log("step2 — id=1,2 true:", step2[0].completed, step2[1].completed);
console.log("step3 — все true:", step3.every((t) => t.completed === true));
console.log("step1 !== step0:", step1 !== step0);
console.log("step2 !== step1:", step2 !== step1);
console.log("step3 !== step2:", step3 !== step2);
console.log("Итоговая сводка:", getTaskStats(step3)); // {total:3, completed:3, pending:0, progress:100}

// ============================================================
// Проверка сохранности: t3 не изменился
// ============================================================

console.log("\nt3 не изменился:", step0.every((t) => t.completed === false));