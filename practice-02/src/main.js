"use strict";

import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
} from "./task-service.js";

// ============================================================
// Вспомогательные функции вывода
// ============================================================

function printTasks(label, tasks) {
  console.log(`\n--- ${label} ---`);
  if (tasks.length === 0) {
    console.log("(пусто)");
    return;
  }
  for (const task of tasks) {
    console.log(`  id=${task.id} | ${task.title} | completed=${task.completed} | ${task.priority}`);
  }
}

function printTitles(label, tasks) {
  console.log(`\n${label}:`);
  console.log(getTaskTitles(tasks));
}

function printPending(label, tasks) {
  const pending = getPendingTasks(tasks);
  console.log(`\n${label}:`);
  console.log(pending.map((t) => `id=${t.id} (${t.title})`));
}

function printStats(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`\n${label}:`);
  console.log(`Всего: ${total}; выполнено: ${completed}; осталось: ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

// ============================================================
// Универсальный сценарий: одни и те же шаги для любого набора
// ============================================================

function runScenario(label, initialTasks, ids) {
  console.log(`\n\n============================================================`);
  console.log(`СЦЕНАРИЙ: ${label}`);
  console.log(`============================================================`);

  // Снимок до всех операций — для проверки отсутствия мутации
  const snapshotBefore = JSON.stringify(initialTasks);

  // 1. Исходные данные
  printTasks("Исходные задачи", initialTasks);
  printTitles("Названия исходных задач", initialTasks);
  printPending("Невыполненные исходные задачи", initialTasks);
  printStats("Исходная сводка", initialTasks);

  // Текущее состояние начинается с исходного массива
  let current = initialTasks;

  // 2. Добавление
  console.log(`\n>>> Действие: addTask(current, ${ids.add.id}, "${ids.add.title}", "${ids.add.priority}")`);
  const added = addTask(current, ids.add.id, ids.add.title, ids.add.priority);
  if (added.ok) {
    current = added.tasks;
    console.log(`OK. Задач стало: ${current.length}`);
  } else {
    console.log(`Ошибка: ${added.error}`);
  }
  printStats("Сводка после добавления", current);

  // 3. Изменение completed
  console.log(`\n>>> Действие: setTaskCompleted(current, ${ids.complete}, true)`);
  const completed = setTaskCompleted(current, ids.complete, true);
  if (completed.ok) {
    current = completed.tasks;
    console.log("OK");
  } else {
    console.log(`Ошибка: ${completed.error}`);
  }
  printStats("Сводка после изменения статуса", current);

  // 4. Переименование
  console.log(`\n>>> Действие: renameTask(current, ${ids.rename}, "${ids.renameTitle}")`);
  const renamed = renameTask(current, ids.rename, ids.renameTitle);
  if (renamed.ok) {
    current = renamed.tasks;
    console.log("OK");
  } else {
    console.log(`Ошибка: ${renamed.error}`);
  }
  printStats("Сводка после переименования", current);

  // 5. Удаление
  console.log(`\n>>> Действие: removeTask(current, ${ids.remove})`);
  const removed = removeTask(current, ids.remove);
  if (removed.ok) {
    current = removed.tasks;
    console.log("OK");
  } else {
    console.log(`Ошибка: ${removed.error}`);
  }
  printStats("Сводка после удаления", current);

  // 6. Показ отказа — повторное добавление уже существующего id
  console.log(`\n>>> Действие: повторное addTask(current, ${ids.add.id}, "Повтор")`);
  const duplicate = addTask(current, ids.add.id, "Повтор");
  console.log("Результат:", duplicate);
  console.log("Состояние НЕ заменяется при ошибке. Задач осталось:", current.length);

  // 7. Итоговое состояние
  printTasks("Итоговые задачи", current);
  printStats("Итоговая сводка", current);

  // 8. Проверка сохранности исходного массива
  const snapshotAfter = JSON.stringify(initialTasks);
  console.log(`\nИсходный ${label} не изменился:`, snapshotBefore === snapshotAfter);
}

// ============================================================
// Запуск обоих сценариев
// ============================================================

runScenario("Общий сценарий (demoTasks)", demoTasks, {
  add: { id: 20, title: "Добавить проверку", priority: "high" },
  complete: 4,
  rename: 10,
  renameTitle: "  Подготовить инструкцию запуска  ",
  remove: 7,
});

runScenario(`Вариант ${variantNumber}`, variantTasks, {
  add: { id: 80, title: "Сделать страницу благодарности", priority: "low" },
  complete: 11,
  rename: 23,
  renameTitle: "  Обновить раздел «О себе»  ",
  remove: 37,
});