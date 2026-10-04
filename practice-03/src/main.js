import { demoTasks, variantTasks, variantNumber } from "./data.js";
import { findTaskById, setTaskCompleted, removeTask } from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderTaskList, renderSummary, renderEmptyState } from "./task-view.js";

const elements = {
  list: document.querySelector("#task-list"),
  filters: document.querySelector("#task-filters"),
  summary: document.querySelector("#task-summary"),
  empty: document.querySelector("#empty-message"),
  message: document.querySelector("#operation-message"),
  datasetLabel: document.querySelector("#dataset-label"),
};

// Готовая служебная часть: ?dataset=variant включает данные своего варианта.
// Наборы не смешиваются, редактировать код для переключения не требуется.
const isVariant = new URLSearchParams(window.location.search).get("dataset") === "variant";
const initialTasks = isVariant ? variantTasks : demoTasks;
let currentTasks = initialTasks.map((task) => ({ ...task }));
let currentFilter = "all";

elements.datasetLabel.textContent = isVariant
  ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}`
  : "Общий контрольный набор";

function renderApp() {
  // ВРЕМЕННАЯ версия для проверки задания 2.
  // В задании 4 будет полная реализация.
  renderTaskList(elements.list, currentTasks);
}

function handleTaskListClick(event) {
  // 1. Убедиться, что цель — элемент (может быть текстовый узел).
  if (!(event.target instanceof Element)) return;

  // 2. Найти ближайшую кнопку с data-action.
  const button = event.target.closest("button[data-action]");
  if (!button || !elements.list.contains(button)) return;

  // 3. Распознать действие.
  const action = button.dataset.action;
  if (action !== "toggle" && action !== "delete") return;

  // 4. Найти карточку и её id.
  const card = button.closest("li[data-task-id]");
  if (!card) return;

  const rawId = card.dataset.taskId;
  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    elements.message.textContent = `Ошибка: некорректный id задачи "${rawId}"`;
    return;
  }

  // 5. Найти актуальную задачу.
  const task = findTaskById(currentTasks, id);
  if (!task) {
    elements.message.textContent = `Ошибка: задача с id ${id} не найдена`;
    return;
  }

  // 6. Вызвать функцию ПР2.
  let result;
  if (action === "toggle") {
    result = setTaskCompleted(currentTasks, id, !task.completed);
  } else {
    result = removeTask(currentTasks, id);
  }

  // 7. Обработать результат.
  if (!result.ok) {
    elements.message.textContent = `Ошибка: ${result.error}`;
    return;
  }

  // 8. Успех: обновить состояние, очистить сообщение, перерисовать.
  currentTasks = result.tasks;
  elements.message.textContent = "";
  renderApp();
  restoreTaskFocus(id, action);
}

function handleFilterClick(event) {
  // TODO: найти кнопку фильтра, проверить all/pending/completed.
  // TODO: изменить только currentFilter, очистить сообщение и вызвать renderApp().
  throw new Error("Не реализовано: handleFilterClick");
}

// Готовая вспомогательная функция. Сохраняет понятную позицию клавиатурного фокуса
// после замены карточек. Если карточки больше нет, фокус получает активный фильтр.
function restoreTaskFocus(id, action) {
  const actionButton = elements.list.querySelector(
    `[data-task-id="${id}"] button[data-action="${action}"]`,
  );
  const filterButton = elements.filters.querySelector(`[data-filter="${currentFilter}"]`);
  (actionButton ?? filterButton)?.focus();
}

// Подписки выполняются один раз. Эти контейнеры не заменяются при перерисовке.
elements.list.addEventListener("click", handleTaskListClick);
elements.filters.addEventListener("click", handleFilterClick);

// До реализации renderApp ожидается сообщение о заглушке.
// try/catch здесь — готовая диагностика старта, а не замена проверки result.ok.
try {
  renderApp();
} catch (error) {
  elements.message.textContent = `Ошибка запуска: ${error.message}`;
  console.error(error);
}
